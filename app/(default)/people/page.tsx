import Link from 'next/link'

export const metadata = {
    title: 'Join Us',
    description: 'Join our team at Helmholtz Munich. We have positions available for postdoctoral fellows, PhD candidates, and students (HiWi, Bachelor, Master, Internship).',
}

export default function People() {
    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Page header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-5xl font-semibold text-transparent">Join Our Team</h1>
                        <p className="text-xl text-indigo-200/65">
                            We are looking for talented individuals who are passionate about developing open-source software solutions for biomedical research.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl mx-auto space-y-16">
                        {/* Application Instructions */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-200 mb-6">How to Apply</h2>
                            <div className="space-y-6 text-indigo-200/65">
                                <p>
                                    Please apply through our official job portal by clicking the button below. Make sure to include your CV, a letter of interest tailored to our group, references, and if possible, a link to your code repository.
                                </p>
                                <div className="text-center pt-4">
                                    <a
                                        href="https://jobs.helmholtz-muenchen.de/jobposting/59f5ff85d5e27c825d41d3d7e58637ddc2dfddf50"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/10 w-full mb-4 sm:w-auto sm:mb-0"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                                <p>
                                    Your letter of interest should mention specific projects or articles of our group that interest you and explain how you would fit into our team.
                                </p>
                            </div>
                        </div>

                        {/* Available Positions */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-200 mb-6">Available Positions</h2>
                            <div className="space-y-6 text-indigo-200/65">
                                <p>
                                    We have open positions for:
                                </p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Postdoctoral fellows</li>
                                    <li>PhD candidates</li>
                                    <li>Student assistants (HiWi)</li>
                                    <li>Master thesis</li>
                                    <li>Bachelor thesis</li>
                                    <li>Internships</li>
                                </ul>
                                <p>
                                    We welcome spontaneous applications from qualified candidates. Student positions typically run for six months or longer, though shorter internships of 3 months are possible for local students. For student applications, please include information about relevant lectures you have attended.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center pt-8">
                            <a
                                href="https://github.com/slolab"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/10 w-full mb-4 sm:w-auto sm:mb-0"
                            >
                                Learn more about our work
                            </a>
                        </div>

                        {/* Core Aims and Benefits */}
                        <div className="space-y-12 text-indigo-200/65">
                            {/* Research Focus */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-200 mb-6">We aim to:</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">1. Drive AI Methodology</h3>
                                        <p>Develop and refine machine learning, deep learning, and knowledge graph-based approaches to integrate, analyze, and interpret biomedical data.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">2. Build Accessible Tools</h3>
                                        <p>Create open-source software frameworks (extending the BioCypher ecosystem) for researchers across disciplines to deploy AI solutions.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">3. Investigate Large Language & Multimodal Models</h3>
                                        <p>Extend AI techniques to textual and imaging data to deepen our understanding of model capabilities and limitations in biomedical contexts.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">4. Collaborate within a Multi-Disciplinary Network</h3>
                                        <p>Engage with researchers at Helmholtz Munich and the DZD, as well as existing project group members at Heidelberg University Hospital and the European Bioinformatics Institute (EMBL-EBI, Hinxton, Cambridge), benefiting from an extensive network of biomedical experts and clinicians.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-200 mb-6">Benefits and Environment</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Work-Life Balance</h3>
                                        <ul className="list-disc list-inside ml-4 space-y-1">
                                            <li>Flexible working hours</li>
                                            <li>Home office options</li>
                                            <li>Education and training opportunities</li>
                                            <li>Elder care support</li>
                                            <li>Child care facilities</li>
                                            <li>Pension scheme</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Cutting-Edge Research Environment</h3>
                                        <p>Conduct research at one of Europe's leading centers for biomedical computation and AI, with state-of-the-art infrastructure and resources.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Outstanding Network</h3>
                                        <p>Collaborate with the German Centre for Diabetes Research (DZD), project group members at Heidelberg University Hospital and EMBL-EBI, and a global network of prestigious institutions.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Professional Development</h3>
                                        <ul className="list-disc list-inside ml-4 space-y-1">
                                            <li>Scientific training at Helmholtz Munich's graduate school programs</li>
                                            <li>Opportunities to attend conferences, workshops, and seminars</li>
                                            <li>Visit project partners within and outside of Germany</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Location</h3>
                                        <p>Munich, with its numerous lakes and proximity to the Alps, is considered one of the cities offering the best quality of life worldwide. Its first-class universities and world-leading research institutions provide an intellectually stimulating environment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 