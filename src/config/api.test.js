import { socketUrlFrom } from './api';

test('websocket url follows the api base url and its routing prefix', () => {
  expect(socketUrlFrom('http://localhost:8080')).toBe('ws://localhost:8080/ws');
  expect(socketUrlFrom('https://host.example/aihelper/')).toBe('wss://host.example/aihelper/ws');
});
