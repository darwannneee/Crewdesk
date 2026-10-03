import { describe, it, expect } from 'vitest'
import { initialState, demoReducer, getAgentStatus } from './demo'
describe('demo workflow', () => {
 it('starts planning with lead working', () => { const s=demoReducer(initialState,{type:'start'}); expect(s.status).toBe('running'); expect(s.phase).toBe(0); expect(getAgentStatus('Lead',s)).toBe('working') })
 it('does not advance while paused, then resumes', () => { let s=demoReducer(initialState,{type:'start'}); s=demoReducer(s,{type:'pause'}); expect(demoReducer(s,{type:'tick'})).toBe(s); s=demoReducer(s,{type:'resume'}); expect(demoReducer(s,{type:'tick'}).phase).toBe(1) })
 it('completes all phases and supports clean replay', () => { let s=demoReducer(initialState,{type:'start'}); for(let i=0;i<4;i++)s=demoReducer(s,{type:'tick'}); expect(s.status).toBe('completed'); expect(getAgentStatus('QA',s)).toBe('done'); s=demoReducer(s,{type:'start'}); expect(s.phase).toBe(0); expect(s.activity).toHaveLength(1) })
 it('reset clears a running task', () => { const s=demoReducer(initialState,{type:'start'}); expect(demoReducer(s,{type:'reset'})).toEqual(initialState) })
 it('ignores duplicate starts and inactive ticks', () => { const s=demoReducer(initialState,{type:'start'}); expect(demoReducer(s,{type:'start'})).toBe(s); expect(demoReducer(initialState,{type:'tick'})).toBe(initialState) })
 it('bounds activity history', () => { let s=demoReducer(initialState,{type:'start'}); for(let i=0;i<50;i++){s=demoReducer(s,{type:'pause'});s=demoReducer(s,{type:'resume'})} expect(s.activity.length).toBeLessThanOrEqual(24) })
})
