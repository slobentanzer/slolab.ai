import PeopleShowcase from '@/components/people-showcase'
import { loadTeamMembers } from '@/lib/team-members/load-team-members'

export const metadata = {
    title: 'Our Team',
    description: 'Meet the talented researchers and scientists driving innovation in biomedical AI research.',
}

export default async function People() {
    const { currentMembers } = await loadTeamMembers()

    return <PeopleShowcase members={currentMembers} />
}