"use client";

import Image from "next/image";
import { SocialButton } from "./SocialButton";
import { FooterLink } from "./FooterLink";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 w-full pb-[env(safe-area-inset-bottom)]">
      <div className="w-full px-1 pb-1 sm:px-1 sm:pb-1 md:px-2 md:pb-2">
        <div className="rounded-3xl border border-[#FFFFFF1A] bg-[#080F1CCC] px-4 pb-6 pt-10 backdrop-blur-[90px] sm:px-6 md:px-8 lg:px-20">
          <div className="grid gap-10 lg:items-start lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div>
              <a
                href="https://sui.io/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
                aria-label="Sui homepage"
              >
                <Image
                  src="/sui_logo.svg"
                  alt="Sui logo"
                  className="h-10 w-auto"
                  width={40}
                  height={40}
                />
              </a>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Learn, build, and grow with our community.
              </p>
            </div>
            <nav>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200">
                Explore
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
                <FooterLink href="https://sui.io/" label="Introduction" />
                <FooterLink href="https://sui.io/events" label="Events" />
                <FooterLink
                  href="https://docs.sui.io/"
                  label="Developer Portal"
                />
                <FooterLink href="https://blog.sui.io/" label="Blog" />
              </div>
            </nav>

            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200">
                Join the Community
              </h3>
              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:gap-6">
                <SocialButton
                  href="https://discord.com/invite/sui"
                  ariaLabel="Join us on Discord"
                >
                  <Image
                    src="/discord.svg"
                    alt="Discord"
                    className="h-5 w-5"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-semibold">
                    Join us on Discord
                  </span>
                </SocialButton>

                <SocialButton
                  href="https://x.com/SuiNetwork"
                  ariaLabel="Follow us on Twitter"
                >
                  <Image
                    src="/XLogo.svg"
                    alt="X"
                    className="h-5 w-5"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-semibold">
                    Follow us on Twitter
                  </span>
                </SocialButton>
              </div>
            </div>
          </div>
          <div className="mt-8 h-px w-full bg-white/10" />
          <p className="mt-6 text-center text-xs text-slate-400">
            ©{year} Copyright Sui Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
