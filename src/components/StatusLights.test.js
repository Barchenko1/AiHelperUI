import { render, screen, waitFor } from '@testing-library/react';
import StatusLights from './StatusLights';

const colorOf = (label) => screen.getByText(label).querySelector('.status-dot').classList.contains('green') ? 'green' : 'red';

function serverSays(body) {
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(body) });
}

test('auto screen light is green while screenshots keep arriving', async () => {
  serverSays({ session: true, clients: { cli: 2, extension: null, autoscreen: 12 } });

  render(<StatusLights token="t" code="123456" />);

  await waitFor(() => expect(colorOf('Auto screen')).toBe('green'));
});

test('auto screen light is red when stopped or stale', async () => {
  serverSays({ session: true, clients: { cli: 2, extension: null, autoscreen: 90 } });

  render(<StatusLights token="t" code="123456" />);

  await waitFor(() => expect(colorOf('CLI')).toBe('green'));
  expect(colorOf('Auto screen')).toBe('red');
});
