import { Box } from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import InfoCard from '../components/ui/InfoCard'
import SectionTitle from '../components/ui/SectionTitle'
import { projects } from '../data/siteContent'

function ProjectsSection() {
  return (
    <SectionWrapper id="projects">
      <SectionTitle
        eyebrow="Projects"
        title="Selected Recent Work"
        description="A snapshot of project types we deliver with practical timelines, quality control, and measurable outcomes."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {projects.map((project) => (
          <InfoCard
            key={project.name}
            title={project.name}
            subtitle={`${project.type} · ${project.year}`}
            description={project.scope}
            footer="Delivered by Benson"
          />
        ))}
      </Box>
    </SectionWrapper>
  )
}

export default ProjectsSection
