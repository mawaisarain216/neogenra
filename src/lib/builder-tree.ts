import type { BlockType, BuilderBlock } from '@/lib/builder'

export function normalizeBlocks(value: unknown): BuilderBlock[] {
  const raw = Array.isArray(value) ? value : value && typeof value === 'object' && Array.isArray((value as {blocks?:unknown}).blocks) ? (value as {blocks:unknown[]}).blocks : []
  return raw.flatMap((item) => normalizeBlock(item)).slice(0, 200)
}

function normalizeBlock(value: unknown): BuilderBlock[] {
  if (!value || typeof value !== 'object') return []
  const b = value as Record<string, unknown>
  const type = typeof b.type === 'string' ? b.type as BlockType : null
  if (!type) return []
  const props = b.props && typeof b.props === 'object' ? b.props as Record<string, unknown> : {}
  const style = b.style && typeof b.style === 'object' ? b.style as BuilderBlock['style'] : {desktop:{},tablet:{},mobile:{}}
  const children = Array.isArray(b.children) ? normalizeBlocks(b.children) : undefined
  if (type==='columns' && Array.isArray(props.children)) {
    props.children=(props.children as unknown[]).map(col=>Array.isArray(col)?normalizeBlocks(col):[])
  }
  return [{ id: typeof b.id === 'string' ? b.id : crypto.randomUUID(), type, props, style, children }]
}

export function mapTree(blocks: BuilderBlock[], id: string, fn: (block: BuilderBlock) => BuilderBlock): BuilderBlock[] {
  return blocks.map((block) => {
    let next = block.id === id ? fn(block) : block
    if (next.children) next={...next,children:mapTree(next.children,id,fn)}
    if (next.type==='columns' && Array.isArray(next.props.children)) {
      const cols=(next.props.children as unknown[][]).map(col=>mapTree(col as BuilderBlock[],id,fn))
      next={...next,props:{...next.props,children:cols}}
    }
    return next
  })
}

export function removeTree(blocks: BuilderBlock[], id: string): BuilderBlock[] {
  return blocks.filter((block) => block.id !== id).map((block) => {
    let next=block.children ? {...block,children:removeTree(block.children,id)} : block
    if(next.type==='columns'&&Array.isArray(next.props.children)) next={...next,props:{...next.props,children:(next.props.children as unknown[][]).map(col=>removeTree(col as BuilderBlock[],id))}}
    return next
  })
}

export function findTree(blocks: BuilderBlock[], id: string): BuilderBlock | undefined {
  for (const block of blocks) {
    if (block.id===id) return block
    const found=block.children&&findTree(block.children,id); if(found)return found
    if(block.type==='columns'&&Array.isArray(block.props.children)) for(const col of block.props.children as unknown[][]){const nested=findTree(col as BuilderBlock[],id);if(nested)return nested}
  }
}
