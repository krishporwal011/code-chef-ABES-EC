import React from 'react';
import { Link } from 'react-router-dom';
import { ChefLogo } from '../brand/ChefLogo';
import { StampBadge, TrainTrackBorder } from '../brand/DoodleGraphics';
import { MapPin, Mail, Terminal, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141311] text-[#EDE6DA] pt-14 pb-8 border-t-4 border-[#2A2722] relative overflow-hidden select-none font-sans">
      {/* Decorative Track Border */}
      <div className="absolute top-0 inset-x-0 opacity-40">
        <TrainTrackBorder className="w-full h-3 text-[#F5B82E]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Identity & Spirit */}
          <div className="md:col-span-2 space-y-4">
            <ChefLogo size="lg" variant="monochrome" className="text-white" />
            <p className="text-sm font-sans text-stone-400 max-w-md leading-relaxed">
              The official chapter of CodeChef at ABES Engineering College. We turn budding students into seasoned culinary coders—serving algorithmic master-dishes, 24-hour hackathons, and endless learning.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <StampBadge label="ESTD. ABESEC" variant="yellow" rotate="-2deg" />
              <StampBadge label="#TECHCHEFS" variant="green" rotate="3deg" />
              <StampBadge label="ALL ABOARD" variant="red" rotate="-1deg" />
            </div>
          </div>

          {/* Col 2: Navigation Stations */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F5B82E] font-bold">
              PLATFORMS & ROUTES
            </h4>
            <ul className="space-y-2 text-xs font-mono text-stone-400">
              <li>
                <Link to="/" className="hover:text-tomato transition-colors">
                  Platform #1: Station Junction (Home)
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-tomato transition-colors">
                  Departures Yard: All Events
                </Link>
              </li>
              <li>
                <a href="/#kitchen" className="hover:text-tomato transition-colors">
                  Bawarchikhaana: 8 Kitchen Stations
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-tomato transition-colors text-amber-300">
                  Control Room (Station Master Gate)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Station Terminus Info */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F5B82E] font-bold">
              STATION TERMINUS
            </h4>
            <div className="text-xs font-mono text-stone-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-tomato flex-shrink-0 mt-0.5" />
                <span>ABES Engineering College, 19th KM Stone, NH-24, Ghaziabad, UP 201009</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-turmeric flex-shrink-0" />
                <span>codechef@abes.ac.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Tagline: "Code. Colab. Conquer."</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-tomato fill-tomato" />
            <span>by the Bawarchis of CodeChef ABESEC Chapter</span>
          </div>

          <div className="text-stone-400 text-center sm:text-right">
            Recruitment Drive Submission • Bawarchi Express v2.0
          </div>
        </div>
      </div>
    </footer>
  );
};
