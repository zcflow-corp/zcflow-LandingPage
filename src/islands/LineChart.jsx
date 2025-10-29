import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function useCssVar(name, fallback){ const [v,setV]=React.useState(fallback); React.useEffect(()=>{ if(typeof window==='undefined') return; const r=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); if(r) setV(r);},[name]); return v; }

export default function LineChart(){
  const color1=useCssVar('--d1','#0563ff'); const color2=useCssVar('--d3','#3385ff'); const labelColor='#6b7da6'; const gridColor='rgba(0,0,0,.08)';
  const data=React.useMemo(()=>({ labels:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'], datasets:[{label:'Ingresos',data:[10,14,12,18,22,24,28,31],borderColor:color1,backgroundColor:'transparent',tension:.35},{label:'Egresos',data:[9,10,11,13,14,16,17,18],borderColor:color2,backgroundColor:'transparent',tension:.35}]}),[color1,color2]);
  const options=React.useMemo(()=>({ responsive:true, plugins:{legend:{display:true,labels:{color:labelColor}}}, scales:{ x:{ticks:{color:labelColor},grid:{color:gridColor}}, y:{ticks:{color:labelColor},grid:{color:gridColor}} } }),[]);
  return <Line data={data} options={options} />;
}
