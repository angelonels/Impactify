import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Background handled by App.jsx LiquidEther */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl mx-auto px-6 py-12 w-full"
            >
                <div className="mb-8">
                    <Link to="/signup" className="inline-flex items-center text-gray-400 hover:text-white transition-colors gap-2 mb-6 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign Up
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <ScrollText className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
                    </div>
                    <p className="text-gray-400 text-lg">Last updated: December 6, 2025</p>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 text-gray-300 leading-relaxed shadow-2xl text-left">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using the Impactify platform ("Service"), provided by Impactify Inc. ("Company," "we," "us," or "our"), you agree to comply with and be bound by these Terms of Service. These terms apply to all visitors, users, and others who access or use the Service. If you disagree with any part of the terms, then you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p>
                            Impactify provides advanced data analytics, visualization tools, and artificial intelligence-driven insights (collectively, the "Service"). We are constantly innovating and may change, suspend, or discontinue any aspect of the Service at any time, including the availability of any feature, database, or content. We may also impose limits on certain features and services or restrict your access to parts or all of the Service without notice or liability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts & Security</h2>
                        <p>
                            To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property Rights</h2>
                        <p>
                            The Service and its original content (excluding User Data), features, and functionality are and will remain the exclusive property of Impactify and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Impactify.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. User Data & Privacy</h2>
                        <p>
                            You retain all rights and ownership in your data. We do not claim any ownership rights in your User Data. However, by uploading User Data to the Service, you grant us a worldwide, non-exclusive, royalty-free license to access, use, process, copy, distribute, perform, export, and display the User Data only as reasonably necessary (a) to provide, maintain, and improve the Service; (b) to prevent or address service, security, support, or technical issues; or (c) as expressly permitted in writing by you. Your use of the Service is also governed by our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
                        <p>
                            You agree not to use the Service:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>In any way that violates any applicable national or international law or regulation.</li>
                            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
                            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm the Company or users of the Service or expose them to liability.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                        <p>
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                        <p>
                            In no event shall Impactify, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Questions about the Terms of Service should be sent to us at <a href="mailto:legal@impactify.com" className="text-indigo-400 hover:text-indigo-300">legal@impactify.com</a>.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsOfService;
