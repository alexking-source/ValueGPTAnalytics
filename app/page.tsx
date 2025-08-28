'use client';
import { useEffect, useState } from 'react';

type UsageEvent = {
  id: string;
  userId: string;
  accountName: string;
  functionUsed: string;
  salesforceOpportunityId: string | null;
  contentEdits: string | null;
  createdAt: string;
};

export default function Home() {
  const [form, setForm] = useState({
    userId: '',
    accountName: '',
    functionUsed: 'RESEARCH',
    salesforceOpportunityId: '',
    contentEdits: '',
  });
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch('/api/events', { cache: 'no-store' });
    const data = await res.json();
    setEvents(data);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        salesforceOpportunityId: form.salesforceOpportunityId || null,
        contentEdits: form.contentEdits || null,
      }),
    });
    setForm({ userId: '', accountName: '', functionUsed: 'RESEARCH', salesforceOpportunityId: '', contentEdits: '' });
    await load();
    setBusy(false);
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">ValueGPT Analytics (local)</h1>

      <form onSubmit={onSubmit} className="space-y-2 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input className="border p-2 rounded" placeholder="User ID"
            value={form.userId} onChange={(e)=>setForm(f=>({...f,userId:e.target.value}))} />
          <input className="border p-2 rounded" placeholder="Account name"
            value={form.accountName} onChange={(e)=>setForm(f=>({...f,accountName:e.target.value}))} />
          <select className="border p-2 rounded"
            value={form.functionUsed}
            onChange={(e)=>setForm(f=>({...f,functionUsed:e.target.value}))}>
            <option>RESEARCH</option>
            <option>VALUE_STATEMENT</option>
            <option>DISCOVERY_QUESTIONS</option>
            <option>CURRENT_STATE_NEGATIVE_IMPACT</option>
            <option>VALUE_MAPS</option>
          </select>
          <input className="border p-2 rounded" placeholder="SFDC Opp ID (optional)"
            value={form.salesforceOpportunityId}
            onChange={(e)=>setForm(f=>({...f,salesforceOpportunityId:e.target.value}))} />
        </div>
        <textarea className="border p-2 rounded w-full" rows={3}
          placeholder="Content edits (optional)"
          value={form.contentEdits}
          onChange={(e)=>setForm(f=>({...f,contentEdits:e.target.value}))}/>
        <button disabled={busy} className="border rounded px-3 py-2 disabled:opacity-50">
          {busy? 'Saving…':'Add event'}
        </button>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Time</th>
            <th className="p-2">User</th>
            <th className="p-2">Account</th>
            <th className="p-2">Function</th>
            <th className="p-2">SFDC Opp</th>
            <th className="p-2">Edits</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev=>(
            <tr key={ev.id} className="border-t">
              <td className="p-2">{new Date(ev.createdAt).toLocaleString()}</td>
              <td className="p-2">{ev.userId}</td>
              <td className="p-2">{ev.accountName}</td>
              <td className="p-2">{ev.functionUsed}</td>
              <td className="p-2">{ev.salesforceOpportunityId ?? ''}</td>
              <td className="p-2">{ev.contentEdits ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
