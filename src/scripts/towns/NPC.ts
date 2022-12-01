import type Requirement from '~/scripts/achievements/Requirement'
import type MultiRequirement from '~/scripts/achievements/MultiRequirement'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import { useNpcStore } from '~/stores/npc'

interface NPCOptionalArgument {
  requirement?: Requirement | MultiRequirement | OneFromManyRequirement
  image?: string
}

export class NPC {
  constructor(
    public name: string,
    public dialog: string[],
    public options: NPCOptionalArgument = {},
  ) {}

  get dialogHTML(): string {
    return this.dialog.map(line => `<p>${line}</p>`).join('\n')
  }

  public isVisible() {
    return this.options.requirement?.isCompleted() ?? true
  }

  public openDialog = () => {
    console.log('this', this)
    const npcStore = useNpcStore()
    npcStore.name = this.name
    npcStore.dialogHTML = this.dialogHTML
    npcStore.image = this.options.image
    npcStore.npcModalFlag = !npcStore.npcModalFlag
  }
}
