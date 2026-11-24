/* =========================================================================
   HIDDEN IN PLAIN SIGHT: QUIZ CONTENT AND SETTINGS
   This is the only file you need to edit for day-to-day changes.
   ========================================================================= */

window.QUIZ = {

  /* ---------- SETTINGS ---------- */
  settings: {
    // Where the "Book your free workshop" button goes
    bookingUrl: "contact.html",

    // Zapier (or Make / n8n) "Catch Hook" URL. Every completed quiz is sent here,
    // and Zapier adds the person to MailerLite AND creates a row in Notion.
    // Leave empty "" to switch off.
    webhookUrl: "",

    // OPTIONAL: send straight to a MailerLite embedded form as well (no Zapier needed).
    // accountId is already set to your account. Create a NEW form for this quiz
    // (don't reuse the Mighty SHiFTs one) and paste its form ID here.
    mailerlite: {
      accountId: "1241699",
      formId: "204610648534942949"
    },

    // true  = ask for name and email before showing results (lead gen)
    // false = show results first, with the email form underneath
    emailBeforeResults: true,

    // Answer scale for "scale" questions (scores 0, 1, 2, 3)
    scale: ["Not really", "Sometimes", "Often", "Absolutely"],

    // If two suspects score the same, the one earlier in this list wins
    tieBreakOrder: ["program", "expertise", "method", "asset", "network", "trust"]
  },

  /* ---------- INTRO SCREEN ---------- */
  intro: {
    eyebrow: "Free 3-minute quiz",
    headline: "Your next income stream could be hiding in plain sight",
    body: "Put on your detective hat. Fourteen quick questions about what your organisation already knows, does and has, and we'll name the three places most worth investigating.",
    button: "Start the investigation"
  },

  /* ---------- QUESTIONS ----------
     Two types:

     1. type "scale" (the default): a statement answered on the four-point scale.
        Adds 0 to 3 points to one suspect.
        { suspect: "program", text: "..." }

     2. type "choice": pick one option. Each option can add points to any suspects,
        and the chosen label is saved under "field" (handy for Notion and MailerLite).
        { type: "choice", field: "readiness", text: "...", options: [ { label, emoji, scores } ] }

     Suspect keys: program, expertise, method, asset, network, trust
  ---------------------------------------------------------------------------- */
  questions: [
    { suspect: "program",   text: "We run at least one program or service that consistently gets great results." },
    { suspect: "expertise", text: "People regularly come to us for advice, and we usually give it away for free." },
    { suspect: "method",    text: "We have a particular way of doing things that just works, even if we've never given it a name." },
    { suspect: "asset",     text: "We have research, data, resources or content that mostly sits in a folder once we've used it." },
    { suspect: "network",   text: "We regularly connect people who wouldn't otherwise meet." },
    { suspect: "trust",     text: "When we speak about our issue, people listen." },
    { suspect: "program",   text: "People outside our usual audience have asked if they could join or use one of our programs." },
    { suspect: "expertise", text: "Our team knows things about our community or issue that most organisations don't." },
    { suspect: "method",    text: "Other organisations have asked us how we do what we do." },
    { suspect: "asset",     text: "We have a space, tool or piece of technology that gets used less than it could." },
    { suspect: "network",   text: "Businesses or employers already want access to the people or communities we work with." },
    { suspect: "trust",     text: "Our community trusts us in a way that would take someone else years to earn." },

    {
      type: "choice",
      field: "situation",
      text: "Time for your statement. Which sounds most like your organisation right now?",
      hint: "Choose one. No lawyers required.",
      options: [
        { label: "We know we're sitting on something valuable. We just haven't worked out how else it could earn.", scores: { asset: 1, method: 1 } },
        { label: "Our programs and services are great, but we lean heavily on one source of funding.",            scores: { program: 2 } },
        { label: "We have loads of expertise and experience that isn't earning a cent.",                          scores: { expertise: 2 } },
        { label: "We have plenty of leads, but no idea which one is worth chasing.",                               scores: {} },
        { label: "We know we need to grow, but the next step is still a mystery.",                                 scores: {} }
      ]
    },

    {
      type: "choice",
      field: "readiness",
      text: "Say we cracked the case tomorrow. How ready would you be to follow the lead?",
      hint: "Choose one. Honesty helps the investigation.",
      options: [
        { emoji: "🚀", label: "Ready to move. Point us at it.",                                  scores: {} },
        { emoji: "🧭", label: "Ready to investigate, but we'd want help choosing a direction.",  scores: {} },
        { emoji: "📋", label: "We'd need to win over our leadership or board first.",           scores: {} },
        { emoji: "💰", label: "We'd need to find the funding first.",                           scores: {} },
        { emoji: "👀", label: "Just browsing the evidence for now.",                            scores: {} }
      ]
    }
  ],

  /* ---------- DETAILS SCREEN ---------- */
  details: {
    eyebrow: "Almost there",
    headline: "Case nearly closed",
    body: "Tell us where to send your case file. You'll see your top three suspects straight away, and we'll email you the full notes.",
    consent: "Send me the results and a few short emails about finding new revenue. Unsubscribe any time.",
    button: "Reveal my suspects"
  },

  /* ---------- RESULTS ---------- */
  results: {
    eyebrow: "Investigation complete",
    headline: "Your top three suspects have been hiding in plain sight",
    intro: "We haven't found a magic money tree. Yet. But based on your answers, these are the three places we'd investigate first.",
    ps: "Don't overthink your results. You don't need the answer yet. This is about looking at your organisation differently.",
    cta: {
      eyebrow: "The Uncovered Opportunities Workshop",
      headline: "Want to find out what your suspects could become?",
      body: "A free 45-minute session. We take your three suspects, look at what you already have, and work out which opportunity is actually worth exploring first.",
      button: "Book your free workshop"
    }
  },

  /* ---------- THE SIX SUSPECTS ---------- */
  suspects: {
    program: {
      name: "Your program or service",
      hook: "Don't throw the whole thing out. Remix it.",
      body: "You already have something that creates value. Before you build something new, ask whether what you already do could work for someone else: a different audience, a different format, or someone else footing the bill.",
      examples: [
        "A youth mentoring program becomes a corporate program where businesses pay for staff to mentor.",
        "A community wellbeing program is adapted for workplaces.",
        "A job seeker service becomes a paid offer for employers who want to recruit and retain better."
      ],
      investigate: "Who else could benefit from what you already do, and could they be the ones paying for it?"
    },
    expertise: {
      name: "Your expertise",
      hook: "The Freebie Police have been notified.",
      body: "You've built knowledge, experience and insight that you may be giving away far too easily. The advice in coffee chats. The training your team delivers. The thing everyone calls you about when they're stuck.",
      examples: [
        "A youth organisation trains corporate teams who work with young people.",
        "A disability employment specialist runs paid inclusion workshops for employers.",
        "A team with lived experience offers speaking, training or advisory services."
      ],
      investigate: "What does your organisation know that someone else could pay to learn?"
    },
    method: {
      name: "Your method",
      hook: "You might have a secret sauce.",
      body: "You may have developed a way of doing things that gets results. A process, an approach, a framework or a model. Maybe you've never given it a fancy name. That's okay.",
      examples: [
        "A successful mentoring model is taught to other organisations so they can build their own.",
        "A highly effective way of supporting people through change becomes training for other professionals.",
        "A proven community engagement process is packaged into facilitation or a framework."
      ],
      investigate: "Is the way you do things valuable enough for someone else to learn, adopt or use?"
    },
    asset: {
      name: "Your assets",
      hook: "Before you create something new, check the cupboards.",
      body: "Not literally. But your organisation may already be sitting on things that could do more: research, data, content, technology or spaces.",
      examples: [
        "Research you've already done becomes a paid industry report or subscription.",
        "Internal training resources become a toolkit for other organisations.",
        "An underused space hosts paid programs, events or experiences."
      ],
      investigate: "What have you already built that might be capable of doing more?"
    },
    network: {
      name: "Your network",
      hook: "It's what becomes possible when you connect them.",
      body: "Your organisation brings people together. The opportunity isn't selling anyone's contact details (obviously). It's creating something valuable through connections only you are positioned to make.",
      examples: [
        "Strong employer relationships become a paid employment partnership program.",
        "A corporate membership model gives businesses meaningful access to a cause.",
        "Regularly connecting experts with people who need them becomes a structured matching service."
      ],
      investigate: "What could become possible if you connected the right people in the right way?"
    },
    trust: {
      name: "Your trust",
      hook: "Trust is expensive. You've already done the hard part.",
      body: "Building trust takes years. You may have credibility with a community, a recognised voice on an issue, or access to people who genuinely listen to you. That's very valuable.",
      examples: [
        "Paid events or experiences linked to your cause and knowledge.",
        "Speaking, partnerships or education as a respected voice in your industry.",
        "Helping businesses understand and connect with your community through training or advisory work."
      ],
      investigate: "Who already trusts you, and what else could become possible because they do?"
    }
  }
};
