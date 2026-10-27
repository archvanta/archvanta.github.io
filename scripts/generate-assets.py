"""Original procedural SVG illustrations. No external assets, real-project claims or raster libraries."""
from pathlib import Path
import math
ROOT=Path(__file__).resolve().parent.parent/'public'

def study(name,mode,detail=False):
    light=mode==0
    bg='#e1e4df' if light else ('#122235' if mode==2 else '#101d29')
    ink='#788a8b' if light else '#526d88'
    top='#f1f0e6' if light else '#718fac'
    left='#aab6b4' if light else '#344f69'
    right='#778e91' if light else '#243a52'
    parts=[]
    def p(x,y,z):
        return (600+(x-y)*1.12,570+(x+y)*.48-z)
    def polygon(v,fill,stroke=ink,op=1):
        points=' '.join(f'{p(*a)[0]:.1f},{p(*a)[1]:.1f}' for a in v)
        parts.append(f'<polygon points="{points}" fill="{fill}" stroke="{stroke}" stroke-width=".7" opacity="{op}"/>')
    def line(a,b,stroke=ink,width=.7,opacity=1):
        x,y=p(*a);xx,yy=p(*b)
        parts.append(f'<path d="M{x:.1f} {y:.1f}L{xx:.1f} {yy:.1f}" stroke="{stroke}" stroke-width="{width}" opacity="{opacity}"/>')
    def box(x,y,z,w,d,h,colors=None,op=1):
        t,l,r=colors or (top,left,right)
        polygon([(x,y+d,z),(x+w,y+d,z),(x+w,y+d,z+h),(x,y+d,z+h)],l,op=op)
        polygon([(x+w,y,z),(x+w,y+d,z),(x+w,y+d,z+h),(x+w,y,z+h)],r,op=op)
        polygon([(x,y,z+h),(x+w,y,z+h),(x+w,y+d,z+h),(x,y+d,z+h)],t,op=op)
    for i in range(-6,7):
        line((i*50,-310,-12),(i*50,310,-12),opacity=.18)
        line((-310,i*50,-12),(310,i*50,-12),opacity=.18)
    box(-230,-155,-14,460,310,14,('#c2cdca','#879a9b','#6e858c') if light else ('#24394f','#172b40','#142335'))
    for level in range(4):
        z=level*(83 if mode==2 else 62)
        colors=('#7897cb','#38537c','#273c62') if mode==2 else None
        box(-200,-125,z,400,250,8,colors)
        for x in [-185,-65,55,175]:
            for y in [-110,110]:box(x,y,z+8,7,7,55,('#e0e5e1','#9facae','#748a94'))
        if mode==0:
            box(-180,-113,z+8,360,8,50,('#b1bfba','#708e91','#566f7a'))
            for x in range(-180,181,15):
                line((x,115,z+8),(x,115,z+59),'#546f78',1)
            box(-180,111,z+9,360,2,48,('#8aa1aa','#c5d9d1','#4c6d79'),.25)
        if mode==2:
            line((-185,110,z+8),(-65,110,z+60),'#9ab7ff',1.1)
            line((-65,110,z+60),(55,110,z+8),'#9ab7ff',1.1)
            line((55,110,z+8),(185,110,z+60),'#9ab7ff',1.1)
        if mode==3 and level<3:
            for x in [-155,-65,25,115]:
                for y in [-65,15,85]:
                    box(x,y,z+8,38,43,48,('#7d91a1','#344e65','#152c43'))
                    for dz in [20,30,40,50]:line((x+39,y+4,z+dz),(x+39,y+38,z+dz),'#88b5df',1.5)
    roof=4*(83 if mode==2 else 62)
    box(-220,-140,roof,440,280,9)
    if mode==0:
        for x in range(-200,210,26):box(x,-133,roof+9,4,265,5,('#e1e2d7','#b7c3bd','#90a3a4'))
        box(-220,-140,roof+9,440,7,27)
        box(213,-140,roof+9,7,280,27)
    if mode==3:
        for y in [-80,0,80]:line((-230,y,13),(230,y,13),'#729bff',3,.8)
    line((-250,175,0),(240,175,0),'#637cc8' if not light else '#687d8a',.8)
    for x in [-250,240]:line((x,167,0),(x,183,0),'#637cc8' if not light else '#687d8a',.8)
    line((-250,-150,0),(-250,-150,roof+20),'#637cc8' if not light else '#687d8a',.8)
    desc=['SPATIAL MASSING / OPEN THRESHOLD','', 'COORDINATED LAYERS / EXPLODED AXONOMETRIC','TECHNICAL ENVIRONMENT / SYSTEM STUDY'][mode]
    inner=''.join(parts)
    if detail:inner=f'<g transform="translate(-130 -75) scale(1.2)">{inner}</g>'
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><title>{desc} — original concept visualization</title><rect width="1200" height="900" fill="{bg}"/><defs><radialGradient id="ambient"><stop stop-color="{'#fff' if light else '#2b4b6d'}" stop-opacity=".5"/><stop offset="1" stop-color="{bg}" stop-opacity="0"/></radialGradient></defs><ellipse cx="600" cy="400" rx="600" ry="430" fill="url(#ambient)"/>{inner}<g fill="{'#53686a' if light else '#9aafc2'}" font-family="monospace" font-size="11" letter-spacing="2"><text x="45" y="850">ARCHVANTA / CONCEPT STUDY</text><text x="45" y="65">{desc}</text><text x="1020" y="850">AV / 0{mode+1}</text></g><path d="M45 790h60m-60 0v-60M1155 110h-60m60 0v60" stroke="{ink}" stroke-width=".8"/></svg>'''
    (ROOT/'images'/f'{name}{"-detail" if detail else ""}.svg').write_text(svg)
for name,mode in [('threshold',0),('coordination',2),('infrastructure',3)]:
    study(name,mode)
    study(name,mode,True)
mark='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="13" fill="#0c1118"/><g transform="translate(8 8)" fill="none" stroke="#edf0f4"><path d="M6 40 21 8h6l15 32H31L24 23 17 40H6Z" stroke-width="2.3"/><path d="m21 8 6-4 16 32-1 4M27 4l16 32M17 40l6-4 4-9M31 40l6-4" stroke-width="1.3"/><path d="M19 32h10" stroke-width="2"/></g></svg>'''
(ROOT/'favicon.svg').write_text(mark)
(ROOT/'brand-mark.svg').write_text(mark.replace('<rect width="64" height="64" rx="13" fill="#0c1118"/>',''))
(ROOT/'brand-wordmark.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 80"><title>ARCHVANTA</title><g fill="none" stroke="#edf0f4" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"><path d="M8 66 27 13 46 66M16 46h22M66 66V13h20q19 0 19 16T86 46H66m20 0 23 20M172 20q-10-9-21-9-24 0-24 29t24 28q12 0 21-9M192 13v53m0-27h34m0-26v53M245 13l20 53 20-53M300 66l20-53 20 53m-32-20h24M360 66V13l36 53V13M415 13h45m-23 0v53M478 66l20-53 20 53m-32-20h24"/></g></svg>''')

# A black-ink variant is provided for warm-white and printed contexts.
(ROOT/'brand-mark-dark.svg').write_text((ROOT/'brand-mark.svg').read_text().replace('#edf0f4','#172026'))
(ROOT/'brand-wordmark-dark.svg').write_text((ROOT/'brand-wordmark.svg').read_text().replace('#edf0f4','#172026'))
