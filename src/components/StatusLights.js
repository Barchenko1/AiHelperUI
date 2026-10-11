import React, { useEffect, useState } from 'react';
import './StatusLights.css';
import { apiUrl } from '../config/api';

const POLL_MS = 10000;
// CLI pings every 5s and the extension every 30s; allow a couple of missed beats before going red.
// Auto screen (CLI F6) checks in after each delivered screenshot: every 20s, but a round also waits
// for the AI answer, so allow up to 60s between check-ins.
// (A client that stops, switches code or fails a send says "offline" and goes red immediately.)
const CONNECTED_WITHIN_SECONDS = { cli: 15, extension: 75, autoscreen: 60 };

function Light({ ok, label, title }) {
  return (
    <span className="status-light" title={title}>
      <span className={`status-dot ${ok ? 'green' : 'red'}`} />
      {label}
    </span>
  );
}

const StatusLights = ({ token, code }) => {
  const [status, setStatus] = useState(null);
  const [unreachable, setUnreachable] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    const check = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        if (code) headers['X-Auth-Code'] = code;
        const response = await fetch(apiUrl('/status'), { headers });
        const body = await response.json();
        if (!cancelled) {
          setStatus(body);
          setUnreachable(false);
        }
      } catch (e) {
        if (!cancelled) setUnreachable(true);
      }
    };

    check();
    const id = setInterval(check, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [token, code]);

  if (!token) return null;

  const sessionOk = !unreachable && status?.session === true;
  const connected = (client) => {
    const seconds = status?.clients?.[client];
    return sessionOk && typeof seconds === 'number' && seconds <= CONNECTED_WITHIN_SECONDS[client];
  };
  const clientTitle = (name, client) => {
    if (connected(client)) return `${name} is connected with this code`;
    if (!sessionOk) return `${name} not connected: the session is not valid`;
    return `${name} not connected: start it with code ${code} (a different or expired code stays red)`;
  };

  const autoScreenTitle = connected('autoscreen')
    ? 'Auto screen is on: a screenshot is sent every 20s'
    : 'Auto screen is off or failing: press F6 in the CLI (Alt+F6 on Windows/Linux) to start';

  let sessionTitle = 'Logged in';
  if (unreachable) sessionTitle = 'Cannot reach the server';
  else if (!sessionOk) sessionTitle = 'Not logged in: the session expired or the server was restarted - log in again';

  return (
    <div className="status-lights">
      <Light ok={sessionOk} label="Session" title={sessionTitle} />
      <Light ok={connected('cli')} label="CLI" title={clientTitle('CLI', 'cli')} />
      <Light ok={connected('extension')} label="Extension" title={clientTitle('Extension', 'extension')} />
      <Light ok={connected('autoscreen')} label="Auto screen" title={autoScreenTitle} />
    </div>
  );
};

export default StatusLights;
