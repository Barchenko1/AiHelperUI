import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginSection from './LoginSection';

test('a second browser joins the session with the verification code', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ code: '123456', token: 'jwt', expiresAt: '2026-10-16T12:00:00Z' })
  });
  const setCode = jest.fn();
  const setToken = jest.fn();
  render(<LoginSection code="" setCode={setCode} token="" setToken={setToken} />);

  fireEvent.change(screen.getByPlaceholderText('verification code'), { target: { value: '123456' } });
  fireEvent.click(screen.getByText('Join with code'));

  await waitFor(() => expect(setToken).toHaveBeenCalledWith('jwt'));
  expect(setCode).toHaveBeenCalledWith('123456');
  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/v1\/login$/);
  expect(JSON.parse(localStorage.getItem('usersession')).token).toBe('jwt');
});

test('after reload the saved code logs in again', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ code: '123456', token: 'fresh-jwt', expiresAt: '2026-10-16T12:00:00Z' })
  });
  const setToken = jest.fn();
  render(<LoginSection code="123456" setCode={jest.fn()} token="old-jwt" setToken={setToken} />);

  await waitFor(() => expect(setToken).toHaveBeenCalledWith('fresh-jwt'));
  expect(global.fetch.mock.calls[0][1].body.toString()).toBe('code=123456');
});

test('after reload an expired code shows the login form again', async () => {
  localStorage.setItem('usersession', JSON.stringify({ code: '123456', token: 'old-jwt' }));
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  const setToken = jest.fn();
  render(<LoginSection code="123456" setCode={jest.fn()} token="old-jwt" setToken={setToken} />);

  await waitFor(() => expect(setToken).toHaveBeenCalledWith(''));
  expect(localStorage.getItem('usersession')).toBeNull();
});

test('after reload with the server down the saved session is kept', async () => {
  localStorage.setItem('usersession', JSON.stringify({ code: '123456', token: 'old-jwt' }));
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  const setToken = jest.fn();
  render(<LoginSection code="123456" setCode={jest.fn()} token="old-jwt" setToken={setToken} />);

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  expect(setToken).not.toHaveBeenCalled();
  expect(localStorage.getItem('usersession')).not.toBeNull();
});
