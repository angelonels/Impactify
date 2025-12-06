import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const LINK_CLASSES = "inline-flex items-center text-gray-400 hover:text-white transition-colors gap-2 mb-6 group";
const ICON_CONTAINER_CLASSES = "p-3 rounded-xl bg-indigo-400/20 text-indigo-300";
const CONTENT_CONTAINER_CLASSES = "bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 text-gray-300 leading-relaxed shadow-2xl text-left";
const SECTION_HEADING_CLASSES = "text-2xl font-semibold text-white mb-4";
const LIST_CLASSES = "list-disc pl-6 mt-2 space-y-1";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl mx-auto px-6 py-12 w-full"
            >
                <div className="mb-8">
                    <div className="flex justify-start">
                        <Link
                            to="/signup"
                            className={LINK_CLASSES}
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Sign Up
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className={ICON_CONTAINER_CLASSES}>
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">
                            Privacy Policy
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Last updated: December 6, 2025
                    </p>
                </div>

                <div className={CONTENT_CONTAINER_CLASSES}>
                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            1. Introduction
                        </h2>
                        <p>
                            At Impactify ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access or use our platform and services.
                        </p>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            2. Information We Collect
                        </h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create an account, update your profile, or use our interactive features. This includes:
                        </p>
                        <ul className={LIST_CLASSES}>
                            <li><strong>Account Information:</strong> Name, email address, password, and profile details.</li>
                            <li><strong>User Content:</strong> Data, datasets, files, and text that you upload or input into the Service.</li>
                            <li><strong>Communications:</strong> Feedback, support queries, and other communications with us.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            3. How We Use Your Information
                        </h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our Service. Specifically, we use it to:
                        </p>
                        <ul className={LIST_CLASSES}>
                            <li>Process your registration and manage your account.</li>
                            <li>Provide the analytics and AI-driven insights you request.</li>
                            <li>Respond to your comments, questions, and customer service requests.</li>
                            <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
                            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            4. Data Sharing and Disclosure
                        </h2>
                        <p>
                            We do not sell your personal data. We may share your information in the following circumstances:
                        </p>
                        <ul className={LIST_CLASSES}>
                            <li><strong>Service Providers:</strong> With third-party vendors and service providers who need access to such information to carry out work on our behalf (e.g., hosting, analytics).</li>
                            <li><strong>Legal Compliance:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
                            <li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            5. Data Retention
                        </h2>
                        <p>
                            We retain your personal information and User Data for as long as your account is active or as needed to provide you the Service. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            6. Security
                        </h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            7. Your Rights
                        </h2>
                        <p>
                            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict the processing of your data. To exercise these rights, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className={SECTION_HEADING_CLASSES}>
                            8. Changes to This Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. If we make material changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            If you have any questions about this Privacy Policy, please contact us at <a
                                href="mailto:privacy@impactify.com"
                                className="text-indigo-300 hover:text-indigo-200"
                            >
                                privacy@impactify.com
                            </a>.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
