import { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomeSection from './sections/HomeSection'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import ServicesSection from './sections/ServicesSection'
import GallerySection from './sections/GallerySection'
import WhyUsSection from './sections/WhyUsSection'
import ContactSection from './sections/ContactSection'
import { navigationItems } from './data/siteContent'

const SCROLL_OFFSET = 138

function App() {
  const sectionIds = useMemo(() => navigationItems.map((item) => item.id), [])
  const [activeSection, setActiveSection] = useState(sectionIds[0])

  const handleNavigate = (sectionId) => {
    const element = document.getElementById(sectionId)

    if (!element) {
      return
    }

    const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth',
    })

    setActiveSection(sectionId)
  }

  useEffect(() => {
    const updateActiveSection = () => {
      const threshold = window.scrollY + SCROLL_OFFSET + 24
      let current = sectionIds[0]

      sectionIds.forEach((id) => {
        const section = document.getElementById(id)
        if (section && section.offsetTop <= threshold) {
          current = id
        }
      })

      setActiveSection((previous) => (previous === current ? previous : current))
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [sectionIds])

  return (
    <Box>
      <Header
        activeSection={activeSection}
        navigationItems={navigationItems}
        onNavigate={handleNavigate}
      />

      <Box component="main">
        <HomeSection onNavigate={handleNavigate} />
        <AboutSection />
        <ProjectsSection />
        <ServicesSection />
        <GallerySection />
        <WhyUsSection />
        <ContactSection />
      </Box>

      <Footer navigationItems={navigationItems} onNavigate={handleNavigate} />
    </Box>
  )
}

export default App
