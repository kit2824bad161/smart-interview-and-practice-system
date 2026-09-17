import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
export default function NotFoundPage(){ return <div className="flex min-h-screen items-center justify-center bg-canvas p-6"><div className="text-center"><Compass size={46} className="mx-auto text-accent"/><p className="mt-5 font-display text-7xl font-bold">404</p><h1 className="mt-3 text-xl font-bold">This page took a wrong turn.</h1><Link to="/" className="btn-primary mt-7"><ArrowLeft size={16}/> Back home</Link></div></div>; }
