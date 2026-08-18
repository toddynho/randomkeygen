import type { ReactNode } from 'react'
import { GuideLibraryChrome } from './GuideLibraryChrome'

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return <GuideLibraryChrome>{children}</GuideLibraryChrome>
}
