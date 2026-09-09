export type BlockType = 'section'|'container'|'columns'|'hero'|'richText'|'image'|'video'|'stats'|'services'|'projects'|'team'|'testimonials'|'spacer'|'cta'|'contactForm'|'scene3d'|'marquee'
export type ResponsiveStyle = {desktop?:Record<string,unknown>;tablet?:Record<string,unknown>;mobile?:Record<string,unknown>}
export type BuilderBlock = { id:string; type:BlockType; props:Record<string,unknown>; style?:ResponsiveStyle; children?:BuilderBlock[] }
export const blockCatalog: {type:BlockType;label:string;description:string}[] = [
 {type:'section',label:'Section',description:'Full-width section with responsive spacing and background'},
 {type:'container',label:'Container',description:'Centered responsive content container'},
 {type:'columns',label:'Columns',description:'Responsive multi-column layout with nested blocks'},
 {type:'hero',label:'Hero',description:'Editorial headline, copy and primary action'},
 {type:'richText',label:'Rich text',description:'Long-form content'},
 {type:'image',label:'Image',description:'Responsive visual with alt text'},
 {type:'video',label:'Video',description:'Hosted or remote video presentation'},
 {type:'stats',label:'Stats',description:'Metrics and proof points'},
 {type:'services',label:'Services',description:'Live services collection'},
 {type:'projects',label:'Projects',description:'Live portfolio collection'},
 {type:'team',label:'Team',description:'Live team collection'},
 {type:'testimonials',label:'Testimonials',description:'Live customer proof'},
 {type:'spacer',label:'Spacer',description:'Controlled vertical rhythm'},
 {type:'cta',label:'CTA',description:'Conversion-focused call to action'},
 {type:'contactForm',label:'Contact form',description:'Secure lead capture form'},
 {type:'scene3d',label:'3D scene',description:'Interactive cinematic 3D prism with depth and pointer response'},
 {type:'marquee',label:'Kinetic marquee',description:'Animated editorial ticker for capabilities, words or signals'},
]
export function uid(){return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`}
export function createBlock(type:BlockType):BuilderBlock{
 const base={id:uid(),type,props:{},style:{desktop:{},tablet:{},mobile:{}}} as BuilderBlock
 const defaults:Record<BlockType,Record<string,unknown>>={
  section:{eyebrow:'',title:'Section title',body:'',columns:1}, container:{maxWidth:1200,paddingX:24,paddingY:0}, columns:{count:2,gap:24,children:[[],[]]},
  hero:{kicker:'NEOGENRA',title:'Ideas that become impossible to ignore.',body:'Strategy, design and technology for ambitious brands.',cta:'Start a project',href:'/contact'},
  richText:{body:'Write your story here.'},
  image:{src:'',alt:'',caption:''}, video:{src:'',poster:'',title:'Video'},
  stats:{items:[{value:'7+',label:'Years of experience'},{value:'100+',label:'Projects completed'},{value:'10+',label:'Industries served'}]},
  services:{title:'What we do',limit:6}, projects:{title:'Selected work',limit:6}, team:{title:'Meet the team',limit:6}, testimonials:{title:'Client voices',limit:3},
  spacer:{height:120}, cta:{kicker:'Ready?',title:'Let’s build something powerful.',cta:'Start a project',href:'/contact'}, contactForm:{title:'Tell us what you are building.'}, scene3d:{eyebrow:'NEOGENRA / LAB',title:'A living idea engine',caption:'Move your pointer across the scene.'}, marquee:{items:['BRAND','DIGITAL','CONTENT','GROWTH','AI'],speed:24}
 }
 base.props=defaults[type]
 return base
}
