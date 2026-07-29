import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  ChevronDown,
  Check,
} from "lucide-react";

import { LANGUAGES } from "../../i18n/languages";
import { useLanguage } from "../../i18n/LanguageContext";

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", outside);

    return () =>
      document.removeEventListener(
        "mousedown",
        outside
      );
  }, []);

  const current =
    LANGUAGES.find((l) => l.code === locale) ??
    LANGUAGES[0];

  return (
    <div
      ref={ref}
      className="relative z-50"
    >
      {/* Trigger */}

      <button
        onClick={() => setOpen(!open)}
        className="
        flex
        h-11
        items-center
        gap-2
        rounded-lg
        border
        border-gray-200
        bg-white
        px-4
        shadow-sm
        transition-all
        duration-300
        hover:border-primary
        hover:shadow-md
        "
      >
        <Globe
          size={18}
          className="text-primary"
        />

        <span className="text-sm font-medium">
          {current.nativeName}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            transition={{
              duration: .2,
            }}
            className="
            absolute
            right-0
            mt-2
            w-48
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            "
          >

            {/* Header */}

            <div className="border-b border-gray-100 px-3 py-3">

              <div className="flex items-center gap-3">

                <Globe
                  size={18}
                  className="text-primary"
                />

                <div>
                  <h4 className="font-semibold">
                    Select Language
                  </h4>

                </div>

              </div>

            </div>

            {/* Languages */}

            <div className="space-y-1.5">

              {LANGUAGES.map((lang) => {

                const selected =
                  lang.code === locale;

                return (

                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setOpen(false);
                    }}
                    className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    px-3
                    py-1
                    transition-all

                    ${
                      selected
                        ? "bg-primary-50"
                        : "hover:bg-gray-50"
                    }
                    `}
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-xl">
                        {lang.flag}
                      </span>

                      <div className="text-left">

                        <p className="text-md font-medium">
                          {lang.nativeName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {lang.name}
                        </p>

                      </div>

                    </div>

                    {selected && (
                      <Check
                        size={18}
                        className="text-primary"
                      />
                    )}

                  </button>

                );

              })}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}