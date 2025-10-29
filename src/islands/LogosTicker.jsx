import React from 'react';
import data from '@/data/trustedby.json';
export default function LogosTicker(){
  const [visible,setVisible]=React.useState(0);
  React.useEffect(()=>{ const id=setInterval(()=>setVisible(v=>(v+1)%data.logos.length),1800); return ()=>clearInterval(id);},[]);
  return (<div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',width:'100%'}}>
    {data.logos.map((l,i)=>(<img key={i} src={l.src} alt={l.alt} title={l.title} style={{opacity:i===visible?1:.35,transition:'opacity .5s',filter:'grayscale(100%)'}}/>))}
  </div>);
}
