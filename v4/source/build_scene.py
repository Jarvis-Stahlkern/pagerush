"""Original PageRush architecture, CC0. Run with Blender 4.3 bpy or Blender -b -P.
Coordinates in helper functions are Three.js Y-up; saved blend is Z-up.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
M={}
def material(name,color,rough=.7,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=rough;bs.inputs['Metallic'].default_value=metal;M[name]=m
for a in [('limestone',(.68,.62,.5),.88,0),('plaster',(.84,.79,.69),.9,0),('wood',(.28,.15,.07),.68,0),('bronze',(.23,.16,.08),.38,.75),('glass',(.09,.16,.19),.24,.5),('fabric',(.55,.48,.36),1,0),('dark',(.035,.045,.047),.65,0),('light',(1,.77,.43),.4,0),('leaf',(.15,.23,.11),.85,0),('stone',(.32,.34,.3),.86,0)]:material(*a)
def box(name,pos,size,mat,bevel=.025):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(pos[0],-pos[2],pos[1]));o=bpy.context.object;o.name=name;o.dimensions=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(M[mat])
 if bevel:
  b=o.modifiers.new('Architectural edge radius','BEVEL');b.width=bevel;b.segments=2
 return o
def sphere(name,pos,scale,mat):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,location=(pos[0],-pos[2],pos[1]));o=bpy.context.object;o.name=name;o.scale=(scale[0],scale[2],scale[1]);o.data.materials.append(M[mat]);
 for poly in o.data.polygons:poly.use_smooth=True
 return o
# Plaza and a genuine open portal; no solid facade across the camera path.
box('Plaza',(0,-.26,2),(70,.4,65),'limestone',.03)
box('Raised floor',(0,-.06,-3),(18,.15,18),'limestone')
for x in [-5.5,5.5]:box('Ground facade wing',(x,2,4),(7,4,.6),'limestone')
box('Portal lintel',(0,4.25,4),(18,.5,.7),'limestone')
for x in [-1.85,1.85]:box('Bronze portal jamb',(x,1.95,4.38),(.13,3.9,.2),'bronze',.015)
box('Portal illuminated soffit',(0,3.94,4),(3.6,.045,1),'light',.005)
# Three upper stories with recessed window bays and deep vertical fins.
for floor in range(3):
 y=4.8+floor*2.65
 box('Floor slab',(0,y,0),(18,.3,9),'limestone')
 box('Rear upper wall',(0,y+1.2,-4.3),(18,2.4,.4),'plaster')
 for x in [-7.7,-5.5,-3.3,-1.1,1.1,3.3,5.5,7.7]:
  box('Recessed glazing',(x,y+1.3,3.83),(1.9,2.22,.12),'glass',.01)
  box('Vertical stone fin',(x-1.05,y+1.25,4.12),(.18,2.5,.75),'limestone')
  box('Window bronze reveal',(x,y+.25,4),(1.95,.055,.18),'bronze',.01)
box('Roof crown',(0,12.8,0),(18.5,.35,9.5),'limestone')
# Walkable interior, continuous from z=4 to z=-12.
box('Interior rear',(0,2.15,-12),(18,4.3,.3),'plaster')
for x in [-8.8,8.8]:box('Interior side',(x,2.15,-4),(.3,4.3,16),'plaster')
box('Ceiling',(0,4.4,-4),(18,.25,16),'plaster')
for z in [-9,-5,-1,3]:
 for x in [-6,6]:box('Interior column',(x,2,z),(.35,4,.35),'limestone')
for x in [-4,0,4]:box('Recessed ceiling light',(x,4.22,-4),(.045,.035,12),'light',.005)
# Reception and wall slats create real parallax and surface detail.
box('Reception monolith',(2, .66,-7.7),(4.1,1.25,1.3),'limestone',.09)
box('Reception bronze plinth',(2,.12,-7.7),(3.9,.2,1.1),'bronze')
box('Reception worktop',(2,1.31,-7.7),(4.2,.1,1.4),'wood')
for x in range(36):box('Oak acoustic slat',(-7.7+x*.44,2.15,-11.7),(.10,3.9,.14),'wood',.01)
# Lounge furniture, rug and tables.
box('Woven rug',(-4,.04,-5),(5,.035,5),'fabric',.01)
for z in [-6.8,-3.6]:
 box('Sofa seat',(-5,.43,z),(2.7,.48,.95),'fabric',.16)
 box('Sofa back',(-5,.96,z-.45),(2.7,.85,.22),'fabric',.12)
 for x in [-6.2,-3.8]:box('Sofa arm',(x,.7,z),(.22,.7,1.05),'fabric',.09)
box('Low oak table',(-4.8,.42,-5.15),(1.9,.12,1.1),'wood',.09)
for x in [-5.5,-4.1]:box('Table pedestal',(x,.2,-5.15),(.13,.4,.65),'bronze')
for x,z in [(-7,1.7),(7,1.7),(6,-9)]:
 box('Planter',(x,.4,z),(.85,.8,.85),'stone',.09)
 box('Ficus stem',(x,1.35,z),(.055,1.9,.055),'wood',.01)
 for i in range(32):
  a=i*2.399;h=.8+(i%11)*.125;r=.24+(i%4)*.12
  o=sphere('Ficus leaf',(x+math.sin(a)*r,h,z+math.cos(a)*r),(.22,.035,.10),'leaf');o.rotation_euler=(.2*math.sin(a),.35*math.cos(a),a)
# Stepping joints outside are geometry, not enlarged raster frames.
for x in range(-24,25,3):box('Plaza joint',(x,-.05,14),(.018,.01,20),'stone',0)
for z in range(5,26,3):box('Plaza joint',(0,-.045,z),(48,.01,.018),'stone',0)
# Blender inspection camera.
bpy.ops.object.camera_add(location=(19,-26,13));cam=bpy.context.object;cam.name='Exterior inspection';cam.rotation_euler=(Vector((0,0,4))-cam.location).to_track_quat('-Z','Y').to_euler();bpy.context.scene.camera=cam
bpy.context.scene.world.color=(.7,.7,.7)
# Export evaluated, bevelled Blender meshes, grouped by material. Rotation preserves winding.
out={};deps=bpy.context.evaluated_depsgraph_get()
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 mesh=o.evaluated_get(deps).to_mesh();mesh.calc_loop_triangles();name=o.data.materials[0].name;g=out.setdefault(name,{'positions':[],'normals':[],'uv':[]})
 for tri in mesh.loop_triangles:
  for vi,li in zip(tri.vertices,tri.loops):
   v=o.matrix_world@mesh.vertices[vi].co;x,y,z=v.x,v.z,-v.y;g['positions'].extend(round(q,5) for q in (x,y,z));n=tri.normal
   normal=(o.matrix_world.to_3x3().inverted().transposed()@mesh.corner_normals[li].vector).normalized();g['normals'].extend(round(q,5) for q in (normal.x,normal.z,-normal.y))
   uv=(x*.22,z*.22) if abs(n.z)>.5 else ((x*.22,y*.22) if abs(n.y)>.5 else (z*.22,y*.22));g['uv'].extend(round(q,5) for q in uv)
 o.evaluated_get(deps).to_mesh_clear()
(ROOT/'assets/architecture.json').write_text(json.dumps({'generator':'Blender '+bpy.app.version_string,'license':'CC0-1.0','groups':out},separators=(',',':')))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'source/pagerush-architecture.blend'))
print('EXPORTED',sum(len(g['positions'])//9 for g in out.values()),'triangles')
