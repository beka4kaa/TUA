у"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
    {
        id: 1,
        type: "user",
        text: "My application decision is in 5 seconds... 😰",
    },
    {
        id: 2,
        type: "user",
        text: "5... 4... 3... 2... 1...",
    },
    {
        id: 3,
        type: "user",
        text: "I GOT ACCEPTED!!!! 🎉🎊",
        subtext: "THANK YOUUUU!!! 😭❤️",
        highlight: true,
    },
    {
        id: 4,
        type: "academy",
        text: "Congratulations Amy! 🎓",
        subtext: "You're welcome! We knew you could do it 😉✨",
    },
];

export function FloatingMessages() {
    const [visibleCount, setVisibleCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const runAnimation = () => {
            let step = 0;
            const showNext = () => {
                if (step < messages.length) {
                    step++;
                    setVisibleCount(step);
                    setTimeout(showNext, 700);
                } else {
                    // Pause then reset
                    setTimeout(() => {
                        setVisibleCount(0);
                        step = 0;
                        setTimeout(showNext, 400);
                    }, 3000);
                }
            };
            setTimeout(showNext, 600);
        };

        runAnimation();
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="relative lg:pl-8 min-h-[400px] hidden lg:flex items-center justify-center">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />
                <div className="w-full max-w-md" />
            </div>
        );
    }

    const visibleMessages = messages.slice(0, visibleCount);

    return (
        <div className="relative lg:pl-8 min-h-[400px] hidden lg:flex items-center justify-center">
            {/* Background decorative gradients */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />

            {/* Messages Container - always vertically centered */}
            <motion.div
                className="w-full max-w-md flex flex-col gap-3"
                layout
                transition={{ layout: { type: "spring", stiffness: 200, damping: 25 } }}
            >
                {visibleMessages.map((message) => (
                    <motion.div
                        key={message.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            layout: { type: "spring", stiffness: 200, damping: 25 }
                        }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {message.type === "user" ? (
                            <div className="flex items-end gap-2">
                                <div
                                    className={`rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg max-w-[280px] ${message.highlight
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30"
                                            : "bg-primary text-primary-foreground shadow-primary/20"
                                        }`}
                                >
                                    <p className={`text-sm ${message.highlight ? "font-bold" : ""}`}>{message.text}</p>
                                    {message.subtext && <p className="text-sm mt-0.5">{message.subtext}</p>}
                                </div>
                                <div className="h-8 w-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-xs">A</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-end gap-2">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <span className="text-white font-bold text-xs">YA</span>
                                </div>
                                <div className="bg-white border rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg max-w-[280px]">
                                    <p className="text-sm text-foreground">{message.text}</p>
                                    {message.subtext && <p className="text-sm text-foreground mt-0.5">{message.subtext}</p>}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
