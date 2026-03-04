function AboutPage() {
    return (
        <main className="w-full px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-6">
                <section className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">About</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">A gentle reminder that time matters</h1>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        LifeSquares helps you visualize life in weeks so you can reflect with clarity, notice what matters,
                        and live more intentionally.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <article className="bg-white/70 border border-gray-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-gray-800 mb-2">See the big picture</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Each square represents one week, making your timeline easier to understand at a glance.
                        </p>
                    </article>
                    <article className="bg-white/70 border border-gray-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-gray-800 mb-2">Stay intentional</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            A visual rhythm helps you choose what deserves your attention this week.
                        </p>
                    </article>
                    <article className="bg-white/70 border border-gray-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-gray-800 mb-2">Reflect often</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Use the app as a regular check-in to align your time with your values.
                        </p>
                    </article>
                </section>

                <section className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Why I built this</h2>
                    <p className="text-gray-700 leading-relaxed mb-3">
                        This space is yours to personalize. Share your reason for building LifeSquares and the message you want
                        visitors to remember.
                    </p>
                    <p className="text-sm text-gray-500">
                        Tip: edit this text anytime to make your About page feel more personal.
                    </p>
                </section>
            </div>
        </main>
    );
}

export default AboutPage;
