export const metadata = {
    title: "Coming Soon - BioGather",
    description: "BioGather coming soon",
};

export default function Search() {
    return (
        <section className="relative">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-5xl font-semibold text-transparent md:text-6xl">
                            Coming Soon
                        </h1>
                        <p className="mb-8 text-xl text-indigo-200/65">
                            We have started developing a Python framework for knowledge extraction from text and images, working title BioGather. Stay tuned for updates.
                        </p>
                        <div className="mt-8">
                            <a href="/" className="btn bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]">
                                Return Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 