'use client';
import { Component, type ReactNode } from 'react';
// Si WebGL no está disponible, la escena se reemplaza por un aviso y los controles siguen funcionando.
export class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> { state={failed:false}; static getDerivedStateFromError(){return {failed:true};} render(){return this.state.failed ? <div className="scene-unavailable">La vista 3D requiere WebGL. Podés seguir explorando con los controles.</div> : this.props.children;} }
