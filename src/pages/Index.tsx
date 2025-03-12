
/**
 * Index Page (Landing Page)
 * 
 * The main landing page for the EngagePerfect AI application.
 * Showcases app features and guides users to start the caption creation process.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, MessageSquareText, Target, Zap, Share2, PenLine, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import Hero from '@/components/Hero/Hero';
import FeatureCard from '@/components/Features/FeatureCard';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  // Feature data for feature cards section
  const features = [
    {
      icon: <MessageSquareText size={24} />,
      title: "Smart Caption Generation",
      description: "AI-powered captions tailored to your exact content, audience, and platform."
    },
    {
      icon: <Target size={24} />,
      title: "Platform Optimized",
      description: "Get captions specifically crafted for Instagram, TikTok, LinkedIn, and more."
    },
    {
      icon: <PenLine size={24} />,
      title: "Custom Brand Voice",
      description: "Match your unique style with tone and personality adjustments."
    },
    {
      icon: <Image size={24} />,
      title: "Context Awareness",
      description: "Generate captions that perfectly match your visual content."
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Variations",
      description: "Generate multiple options and refine until perfect."
    },
    {
      icon: <Share2 size={24} />,
      title: "One-Click Sharing",
      description: "Copy or directly share to your social media platforms."
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 w-full">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Supercharge your social media presence
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Everything you need to create engaging captions for any social platform
          </motion.p>
        </div>
        
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 w-full">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            A simple 6-step process
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Our guided wizard makes creating perfect captions effortless
          </motion.p>
        </div>
        
        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-12 mt-16">
          {[
            { 
              step: 1, 
              title: "Select your platform", 
              description: "Choose from Instagram, TikTok, Twitter, LinkedIn, or Facebook" 
            },
            { 
              step: 2, 
              title: "Define your style", 
              description: "Select the tone, length, and brand voice for your caption" 
            },
            { 
              step: 3, 
              title: "Provide context", 
              description: "Enter keywords, upload images, or describe your content" 
            },
            { 
              step: 4, 
              title: "Generate captions", 
              description: "Our AI creates multiple variations based on your inputs" 
            },
            { 
              step: 5, 
              title: "Refine and customize", 
              description: "Edit and adjust the generated captions to perfection" 
            },
            { 
              step: 6, 
              title: "Copy and share", 
              description: "Use your caption immediately or save it for later" 
            }
          ].map((step, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row gap-6 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  {step.step}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 w-full">
        <motion.div 
          className="glass-panel rounded-3xl p-10 md:p-16 text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex justify-center mb-6">
            <SparklesIcon size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create captivating captions?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Start generating engaging social media content that connects with your audience and drives engagement.
          </p>
          <PrimaryButton size="lg" className="mx-auto">
            Get Started Now
          </PrimaryButton>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default Index;
