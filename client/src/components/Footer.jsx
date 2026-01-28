import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Mail, MapPin, Phone, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#030608] text-white mt-20">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <Gift size={28} /> TOHFEY DEKHO
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Making gifting effortless with our rule-based engine. Find the perfect product for any occasion in seconds.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <Instagram size={22} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <Twitter size={22} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <Facebook size={22} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">
                                <Linkedin size={22} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-wider uppercase">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/browse" className="text-gray-400 hover:text-white transition-colors">Browse All</Link>
                            </li>
                            <li>
                                <Link to="/quiz" className="text-gray-400 hover:text-white transition-colors">Find Product</Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors">Wishlist</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-wider uppercase">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/settings" className="text-gray-400 hover:text-white transition-colors">Account Settings</Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-wider uppercase">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-400">
                                <Mail size={20} className="mt-1 flex-shrink-0" />
                                <a href="mailto:support@tohfeydekho.com" className="hover:text-white transition-colors">
                                    support@tohfeydekho.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Phone size={20} className="mt-1 flex-shrink-0" />
                                <a href="tel:+911234567890" className="hover:text-white transition-colors">
                                    +91 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>
                                    123 Gift Street,<br />
                                    Mumbai, Maharashtra 400001<br />
                                    India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Tohfey Dekho. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <span className="text-gray-700">•</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                        <span className="text-gray-700">•</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
