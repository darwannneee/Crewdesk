export type Role = 'Lead' | 'Backend' | 'Frontend' | 'QA' | 'DevOps' | 'Security'
export const roles: {role:Role;name:string;description:string;color:string;initials:string;position:[number,number,number]}[] = [
 {role:'Lead',name:'Atlas',description:'Breaks down goals and coordinates the team.',color:'#a69afa',initials:'AT',position:[1.8,2.1,-1.85]},
 {role:'Backend',name:'Byte',description:'Builds the services that keep everything running.',color:'#62cfbc',initials:'BY',position:[-2,2.1,-.1]},
 {role:'Frontend',name:'Pixel',description:'Turns ideas into thoughtful user interfaces.',color:'#78aaf7',initials:'PX',position:[0,2.1,-.1]},
 {role:'QA',name:'Scout',description:'Checks the details and catches regressions.',color:'#f2b46f',initials:'SC',position:[2,2.1,-.1]},
 {role:'DevOps',name:'Flux',description:'Keeps builds and delivery moving smoothly.',color:'#9abf7a',initials:'FL',position:[-2,2.1,2.2]},
 {role:'Security',name:'Cipher',description:'Reviews changes for security and trust.',color:'#d199d6',initials:'CI',position:[0,2.1,2.2]},
]
export const phases = [
 {title:'Plan',detail:'Atlas is breaking down the brief.',agents:['Lead'] as Role[],message:'Atlas mapped the brief into tasks.'},
 {title:'Build',detail:'Byte and Pixel are implementing the changes.',agents:['Backend','Frontend'] as Role[],message:'Byte and Pixel picked up implementation.'},
 {title:'Review',detail:'Scout and Cipher are reviewing the work.',agents:['QA','Security'] as Role[],message:'Scout and Cipher started their review.'},
 {title:'Deliver',detail:'Flux is preparing the final handoff.',agents:['DevOps'] as Role[],message:'Flux is preparing the delivery.'},
]
export type DemoState={status:'idle'|'running'|'paused'|'completed';phase:number;activity:{message:string;time:number}[]}
export type Action={type:'start'|'tick'|'pause'|'resume'|'reset'}
export const initialState:DemoState={status:'idle',phase:0,activity:[]}
function log(state:DemoState,message:string):DemoState{return {...state,activity:[{message,time:Date.now()},...state.activity].slice(0,24)}}
export function demoReducer(state:DemoState,action:Action):DemoState{
 switch(action.type){
 case 'start':return state.status==='idle'||state.status==='completed'?log({...initialState,status:'running'},phases[0].message):state
 case 'reset':return initialState
 case 'pause':return state.status==='running'?log({...state,status:'paused'},'Workflow paused.'):state
 case 'resume':return state.status==='paused'?log({...state,status:'running'},'Workflow resumed.'):state
 case 'tick':if(state.status!=='running')return state;return state.phase===3?log({...state,status:'completed'},'All checks passed. Demo task delivered.'):log({...state,phase:state.phase+1},phases[state.phase+1].message)
 }
}
export function getAgentStatus(role:Role,state:DemoState):'idle'|'working'|'paused'|'done'{
 if(state.status==='idle')return 'idle'
 if(state.status==='completed')return 'done'
 const index=phases.findIndex(p=>p.agents.includes(role))
 if(index<state.phase)return 'done'
 if(index===state.phase)return state.status==='paused'?'paused':'working'
 return 'idle'
}
