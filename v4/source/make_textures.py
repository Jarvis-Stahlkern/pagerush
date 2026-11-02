"""Deterministic original CC0 textures; no downloaded third-party imagery."""
from pathlib import Path
import numpy as np
from PIL import Image
p=Path(__file__).resolve().parents[1]/'assets'; rng=np.random.default_rng(42);n=1024
y,x=np.mgrid[:n,:n];noise=rng.normal(0,1.8,(n,n))
for name,base,signal in [('limestone',(194,183,160),noise+1.7*np.sin(x*.018)*np.sin(y*.03)),('wood',(117,78,44),noise+5*np.sin(x*.11+np.sin(y*.012)*1.3)+3*np.sin(x*.31)),('fabric',(174,161,137),noise+2*np.cos(x*np.pi)+2*np.cos(y*np.pi))]:
 a=np.clip(np.array(base)[None,None,:]+signal[:,:,None],0,255).astype('uint8');Image.fromarray(a).save(p/(name+'.png'),optimize=True)
