'use client'
import { useEffect, useState } from 'react'

type Props={entity:string;title:string;fields:Record<string,string>;id?:string}
export default function AdminEditor({entity,title,fields,id}:Props){
 const [data,setData]=useState(fields); const [csrf,setCsrf]=useState(''); const [state,setState]=useState('')
 useEffect(()=>{fetch('/api/admin/csrf').then(r=>r.json()).then(x=>setCsrf(x.token)).catch(()=>{})},[])
 async function save(){ setState('Saving…'); const parsed:any={...data}; for(const k of ['noIndex','featured','published']) if(k in parsed) parsed[k]=parsed[k]==='true'; for(const k of ['sortOrder']) if(k in parsed) parsed[k]=Number(parsed[k]); for(const k of ['content','gallery','socials','value']) if(k in parsed){ try{parsed[k]=JSON.parse(parsed[k])}catch{setState(`Invalid JSON in ${k}`);return} } const payload=id?{id,data:parsed}:parsed; const res=await fetch(`/api/admin/content/${entity}`,{method:id?'PATCH':'POST',headers:{'Content-Type':'application/json','x-csrf-token':csrf},body:JSON.stringify(payload)}); setState(res.ok?'Saved ✓':(await res.json().catch(()=>({}))).error||'Save failed') }
 return <div className="p-6 md:p-10"><div className="flex items-end justify-between gap-4"><div><div className="text-xs uppercase tracking-[.2em] text-white/35">CMS editor</div><h1 className="mt-2 text-4xl font-bold tracking-[-.05em]">{title}</h1></div><button onClick={save} disabled={!csrf||state==='Saving…'} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{state||'Save changes'}</button></div><div className="mt-10 grid gap-5">{Object.entries(data).map(([k,v])=><label key={k} className="glass rounded-2xl p-5"><span className="text-xs uppercase tracking-[.15em] text-white/35">{k}</span><textarea value={v} onChange={e=>setData({...data,[k]:e.target.value})} className="mt-3 min-h-28 w-full resize-y bg-transparent text-lg outline-none"/></label>)}</div></div>
}
