import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  FolderOpen
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Button } from '../../components/common/Button';
import { FeatureCard } from '../../components/landing/FeatureCard';
import { DashboardPreview } from '../../components/landing/DashboardPreview';

export const Landing = () => {
  const features = [
    {
      icon: Layers,
      title: 'Application Tracking',
      description: 'Track every company and application from one place.'
    },
    {
      icon: MessageSquare,
      title: 'Interview Management',
      description: 'Store interview questions, mistakes, notes, and results.'
    },
    {
      icon: Calendar,
      title: 'Career Calendar',
      description: 'Keep track of interviews, deadlines, OAs, and follow-ups.'
    },
    {
      icon: BookOpen,
      title: 'Question Bank',
      description: 'Organize DSA, DBMS, OS, OOP, System Design, and HR questions.'
    },
    {
      icon: Users,
      title: 'Recruiter Contacts',
      description: 'Organize HR, recruiters, employees, and referral contacts.'
    },
    {
      icon: FolderOpen,
      title: 'Placement Resources',
      description: 'Keep cold emails, referral templates, resume notes, and study material together.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-none">
                Your Entire Placement Journey. <span className="text-primary">One Place.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed">
                Track applications, manage interviews, organize recruiter contacts, prepare interview questions, and keep your placement resources in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Dashboard Preview */}
            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything You Need for Your Placement Journey
            </h2>
            <p className="mt-3 text-slate-500 text-sm sm:text-base">
              A comprehensive toolkit tailored to keep students and developer-candidates organized and prepared.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              How It Works
            </h2>
            <p className="mt-3 text-slate-500 text-sm">
              Three simple steps to transition from applying to getting hired.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-start border-l-2 border-slate-150 pl-6 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                01 — Track
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-950">
                Log Applications
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Add your applications and keep their status updated. Never miss a submission deadline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start border-l-2 border-slate-150 pl-6 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                02 — Prepare
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-950">
                Study and Revise
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Store interview questions, mistakes, notes, and revision material. Build a personal question bank.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start border-l-2 border-slate-150 pl-6 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                03 — Get Placed
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-950">
                Hired!
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Stay organized throughout your placement journey and secure your target job offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Ready to organize your placement journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 text-sm sm:text-base leading-relaxed">
            Stop managing applications, interviews, notes, and contacts across multiple tools. Keep everything in PlaceTrack.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200 pb-8">
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-950">
                PlaceTrack
              </span>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">
                Your complete placement journey, organized in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end items-center text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">
                How It Works
              </a>
              <Link to="/login" className="hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/signup" className="hover:text-primary transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <span>&copy; 2026 PlaceTrack. All rights reserved.</span>
            <span className="mt-2 sm:mt-0">Designed for student success.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
