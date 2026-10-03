"""Generate reusable low-poly office assets with Blender, without external dependencies."""
import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / '3d'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, emission=False):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    shader = m.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = .72
    if emission:
        shader.inputs['Emission Color'].default_value = (*color, 1)
        shader.inputs['Emission Strength'].default_value = 2
    return m

wood = material('Warm oak', (.64, .39, .19))
ivory = material('Ivory', (.84, .82, .73))
navy = material('Midnight navy', (.035, .055, .10))
screen = material('Monitor blue', (.07, .35, .58), True)
blue = material('Blue accent', (.025, .25, .9), True)
green = material('Plant green', (.12, .33, .16))
hair = material('Dark hair', (.065, .038, .024))
skin = material('Warm skin', (.65, .40, .25))

def cube(name, location, scale, mat, parent=None, bevel=.025):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    o = bpy.context.object
    o.name = name
    o.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(mat)
    if bevel:
        mod = o.modifiers.new('Soft edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 1
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier=mod.name)
    o.parent = parent
    return o

def group(name):
    o = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(o)
    return o

def desk(name, x, y):
    p = group(name)
    cube('Oak desktop', (x,y,1.02), (1.6,.85,.10), wood,p)
    for dx in [-.66,.66]:
        cube('Desk support',(x+dx,y,.5),(.12,.65,1),ivory,p)
    cube('Monitor frame',(x,y+.2,1.48),(.85,.07,.52),navy,p)
    cube('Monitor display',(x,y+.158,1.48),(.75,.012,.42),screen,p)
    cube('Monitor stand',(x,y+.2,1.16),(.10,.10,.25),navy,p)
    cube('Keyboard',(x,y-.20,1.10),(.58,.20,.035),navy,p)
    return p

def chair(name,x,y):
    p=group(name)
    cube('Chair seat',(x,y,.61),(.53,.50,.12),navy,p)
    cube('Chair back',(x,y-.23,.98),(.53,.10,.65),navy,p)
    cube('Chair stem',(x,y,.30),(.08,.08,.48),ivory,p)
    cube('Chair base',(x,y,.08),(.58,.10,.08),ivory,p)
    cube('Chair base cross',(x,y,.08),(.10,.58,.08),ivory,p)
    return p

def agent(role,color,x,y):
    p=group('Agent_'+role)
    outfit=material(role+' outfit',color)
    cube('Torso',(x,y,.99),(.40,.28,.49),outfit,p)
    cube('Head',(x,y,1.43),(.34,.32,.34),skin,p)
    cube('Hair',(x,y+.025,1.59),(.36,.32,.12),hair,p)
    for dx in [-.095,.095]:
        cube('Leg',(x+dx,y-.04,.62),(.14,.19,.35),navy,p)
        cube('Shoe',(x+dx,y+.04,.44),(.16,.29,.11),navy,p)
        cube('Eye',(x+dx,y+.166,1.45),(.035,.014,.04),navy,p,0)
    for dx in [-.26,.26]:
        cube('Sleeve',(x+dx,y+.03,1.02),(.13,.18,.28),outfit,p)
        cube('Hand',(x+dx,y+.16,.93),(.12,.14,.12),skin,p)
    return p

room=group('Office_environment')
cube('Floor',(0,0,-.12),(9,7,.24),wood,room)
cube('Back wall',(0,3.45,1.6),(9,.12,3.2),ivory,room)
cube('Left wall',(-4.45,0,1.6),(.12,7,3.2),ivory,room)
cube('Team carpet',(0,-.45,.02),(6.7,4.8,.035),navy,room)
for y in [-2.85,1.95]:
    cube('Carpet blue border',(0,y,.05),(6.7,.035,.035),blue,room)
for x in [-3.35,3.35]:
    cube('Carpet blue border',(x,-.45,.05),(.035,4.8,.035),blue,room)
cube('Planning board',(-2,3.36,2.1),(2,.06,1.05),navy,room)
cube('Planning board face',(-2,3.31,2.1),(1.9,.025,.95),ivory,room)
for i in range(6):
    cube('Task card',(-2.6+(i%3)*.55,3.29,2.32-(i//3)*.38),(.28,.025,.19),screen,room)
for x in [-3.7,3.7]:
    cube('Planter',(x,2.65,.25),(.42,.42,.50),ivory,room)
    for j in range(3):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.32,location=(x+.1*math.sin(j*2),2.65+.1*math.cos(j*2),.65+j*.18))
        o=bpy.context.object
        o.name='Plant foliage'
        o.data.materials.append(green)
        o.parent=room

roles=[('Backend',(.10,.49,.43)),('Frontend',(.15,.35,.75)),('QA',(.94,.45,.10)),('DevOps',(.20,.38,.20)),('Security',(.28,.22,.42)),('Lead',(.13,.18,.28))]
assets=[]
for i,(role,color) in enumerate(roles):
    if i<5:
        x=-2.0+(i%3)*2.0
        y=.8 if i<3 else -1.5
    else:
        x,y=1.8,2.55
    d=desk('Desk_'+role,x,y)
    c=chair('Chair_'+role,x,y-.70)
    a=agent(role,color,x,y-.70)
    assets.append((role,a,d,c))

def export(path, objects):
    bpy.ops.object.select_all(action='DESELECT')
    for parent in objects:
        parent.select_set(True)
        for child in parent.children_recursive:
            child.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True)

export(OUT/'office.glb',[room]+[p for _,a,d,c in assets for p in (a,d,c)])
for role,a,d,c in assets:
    # Individual assets have origins at ground center for placement in the web scene.
    meshes=list(a.children_recursive)
    center=Vector((meshes[0].location.x,meshes[0].location.y,0))
    for o in meshes:
        o.location-=center
    export(OUT/('agent-'+role.lower()+'.glb'),[a])
    for o in meshes:
        o.location+=center
for label,p in [('desk',assets[0][2]),('chair',assets[0][3])]:
    meshes=list(p.children_recursive)
    center=Vector((meshes[0].location.x,meshes[0].location.y,0))
    for o in meshes:
        o.location-=center
    export(OUT/(label+'.glb'),[p])
    for o in meshes:
        o.location+=center

bpy.ops.object.camera_add(location=(11,-15,12))
camera=bpy.context.object
camera.name='Isometric preview camera'
camera.rotation_euler=(Vector((0,0,1))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'
camera.data.ortho_scale=13.8
bpy.context.scene.camera=camera
for position,power,size in [((1,-3,9),1700,7),((-3,2,7),1100,5)]:
    bpy.ops.object.light_add(type='AREA',location=position)
    lamp=bpy.context.object
    lamp.data.energy=power
    lamp.data.shape='DISK'
    lamp.data.size=size
    lamp.rotation_euler=(Vector((0,0,0))-lamp.location).to_track_quat('-Z','Y').to_euler()
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=24
scene.render.resolution_x=1400
scene.render.resolution_y=1100
scene.render.resolution_percentage=100
scene.world.color=(.17,.17,.17)
scene.render.filepath=str(OUT/'office-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'workdesk-office.blend'))
bpy.ops.render.render(write_still=True)
print('ASSETS_COMPLETE',OUT)
