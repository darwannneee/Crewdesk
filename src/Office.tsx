import { Component, Suspense, useRef, useState, type ReactNode } from 'react'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { RotateCcw, Move, ZoomIn } from 'lucide-react'
import { roles, getAgentStatus, type Role, type DemoState } from './demo'
import modelUrl from '../assets/3d/office.glb?url'
import previewUrl from '../assets/3d/office-preview.png'

class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<Fallback/>:this.props.children}
}
function Fallback(){return <div className="scene-fallback"><img src={previewUrl} alt="Isometric office with six agent workstations"/><p>3D preview unavailable. You can still explore the team below.</p></div>}
function Model({onSelect}:{onSelect:(role:Role)=>void}){
 const {scene}=useGLTF(modelUrl)
 const select=(event:ThreeEvent<MouseEvent>)=>{
  let node=event.object
  while(node){if(node.name.startsWith('Agent_')){const role=node.name.slice(6) as Role;if(roles.some(a=>a.role===role)){event.stopPropagation();onSelect(role)}return}if(!node.parent)break;node=node.parent}
 }
 return <primitive object={scene} onClick={select}/>
}
function World({selected,onSelect,state,reset}:{selected:Role;onSelect:(role:Role)=>void;state:DemoState;reset:number}){
 const controls=useRef<OrbitControlsType>(null)
 return <>
  <color attach="background" args={['#171d25']}/>
  <ambientLight intensity={1.2}/>
  <directionalLight position={[3,9,4]} intensity={2.5}/>
  <directionalLight position={[-5,3,-3]} intensity={.6} color="#abcaff"/>
  <Suspense fallback={<Html center><span className="loading">Setting up your office…</span></Html>}>
   <Model onSelect={onSelect}/>
   {roles.map(agent=><Html key={agent.role} position={agent.position} center zIndexRange={[20,0]}><button onClick={()=>onSelect(agent.role)} className={`agent-label ${selected===agent.role?'selected':''}`}><span className={`dot ${getAgentStatus(agent.role,state)}`}/>{agent.role}</button></Html>)}
  </Suspense>
  <OrbitControls key={reset} ref={controls} makeDefault target={[0,.6,0]} enablePan={false} minZoom={35} maxZoom={110} minPolarAngle={.25} maxPolarAngle={Math.PI/2.1}/>
 </>
}
export default function Office(props:{selected:Role;onSelect:(role:Role)=>void;state:DemoState}){
 const [reset,setReset]=useState(0)
 return <section className="office-panel">
  <div className="office-top"><div><span className="dot working"/>Main office <span className="muted">/ Floor 01</span></div><span className="scene-tag">3D workspace</span></div>
  <div className="canvas-wrap"><SceneBoundary><Canvas key={reset} orthographic camera={{position:[11,12,15],zoom:56,near:.1,far:100}} dpr={[1,1.5]} fallback={<Fallback/>}><World {...props} reset={reset}/></Canvas></SceneBoundary></div>
  <div className="office-bottom"><span><Move size={13}/> Drag to orbit <i/> <ZoomIn size={13}/> Scroll to zoom</span><button className="icon-button" title="Reset camera" aria-label="Reset camera" onClick={()=>setReset(v=>v+1)}><RotateCcw size={15}/></button></div>
 </section>
}
