export default function LegalPage({ type }) {
  const isPrivacy = type === "privacy"
  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto" style={{ background:"#0A0A0F", color:"#fff" }}>
      <a href="/" className="inline-flex items-center gap-1.5 text-white/30 text-xs mb-8 hover:text-white/60 transition-colors">← Retour</a>
      {isPrivacy ? <Privacy /> : <CGU />}
    </div>
  )
}

function Section({ n, title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-white/80 font-semibold text-sm mb-3">{n}. {title}</h2>
      <div className="text-white/50 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

function Privacy() {
  return (
    <>
      <div className="mb-10">
        <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-2">Trackova</p>
        <h1 className="text-2xl font-bold text-white mb-1">Politique de Confidentialité</h1>
        <p className="text-white/30 text-xs">Dernière mise à jour : 2026</p>
      </div>
      <Section n="1" title="Introduction"><p>Trackova s'engage à protéger la vie privée de ses utilisateurs. Cette politique explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.</p></Section>
      <Section n="2" title="Données collectées">
        <p>Nous collectons les données suivantes :</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>Adresse email (lors de l'inscription)</li>
          <li>Prénom</li>
          <li>Données d'utilisation : tâches, objectifs, progression, streaks</li>
          <li>Données de navigation : pages visitées, durée de session</li>
        </ul>
        <p className="mt-2">Nous ne collectons jamais de données bancaires. Les paiements sont gérés par un prestataire tiers sécurisé.</p>
      </Section>
      <Section n="3" title="Utilisation des données">
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>Fournir et améliorer le service Trackova</li>
          <li>Vous envoyér des emails liés à votre compte</li>
          <li>Analyser l'utilisation globale (données anonymisées)</li>
        </ul>
        <p className="mt-2">Nous ne vendons jamais vos données à des tiers.</p>
      </Section>
      <Section n="4" title="Stockage et sécurité"><p>Vos données sont hébergées sur des serveurs sécurisés. Nous utilisons des connexions HTTPS et prenons toutes les mesures raisonnables pour protéger vos informations. En cas de violation de données, vous serez notifié dans les 72 heures.</p></Section>
      <Section n="5" title="Cookies"><p>Trackova utilise des cookies essentiels au fonctionnement du service (session, authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p></Section>
      <Section n="6" title="Partage des données">
        <p>Vos données ne sont jamais vendues. Elles peuvent être partagées uniquement avec :</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>Notre hébergeur (Vercel) pour le fonctionnement technique</li>
          <li>Notre prestataire de paiement pour la gestion des abonnéments</li>
        </ul>
      </Section>
      <Section n="7" title="Vos droits (RGPD)">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement ("droit à l'oubli")</li>
          <li>Droit à la portabilité de vos données</li>
          <li>Droit d'opposition'au traitement</li>
        </ul>
        <p className="mt-2">Pour exercer ces droits : <span className="text-violet-400">contact@trackova.app</span></p>
      </Section>
      <Section n="8" title="Conservation des données"><p>Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, toutes vos données sont effacées sous 30 jours.</p></Section>
      <Section n="9" title="Modifications"><p>Nous pouvons modifier cette politique à tout moment. Vous serez notifié par email en cas de changement important.</p></Section>
      <Section n="10" title="Contact"><p>Email : <span className="text-violet-400">contact@trackova.app</span><br/>Site : trackova.vercel.app</p></Section>
    </>
  )
}

function CGU() {
  return (
    <>
      <div className="mb-10">
        <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-2">Trackova</p>
        <h1 className="text-2xl font-bold text-white mb-1">Conditions Générales d'Utilisation</h1>
        <p className="text-white/30 text-xs">Dernière mise à jour : 2026</p>
      </div>
      <Section n="1" title="Objet"><p>Les présentes CGU régissent l'accès et l'utilisation de l'application Trackova, disponible sur trackova.vercel.app. En utilisant Trackova, vous acceptez pleinement ces conditions.</p></Section>
      <Section n="2" title="Description du service"><p>Trackova est une application de suivi d'objectifs personnels couvrant quatre domaines : Études, Sport, Projet personnel et Organisation. L'application propose un essai gratuit de 7 jours suivi d'un'abonnément mensuel à 6€/mois.</p></Section>
      <Section n="3" title="Inscription et compte">
        <p>Pour utiliser Trackova, vous devez :</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>Avoir au moins 13 ans</li>
          <li>Fournir une adresse email valide</li>
          <li>Créer un mot de passe sécurisé</li>
        </ul>
        <p className="mt-2">Vous êtes responsable de la confidentialité de vos identifiants.</p>
      </Section>
      <Section n="4" title="Essai gratuit et abonnément"><p>L'essai gratuit de 7 jours donne accès à toutes les fonctionnalités sans engagement et sans carte bancaire requise. À l'issue de la période d'essai, l'accès aux fonctionnalités premium nécessite un'abonnément à 6€/mois, sans engagement, résiliable à tout moment.</p></Section>
      <Section n="5" title="Paiement"><p>Le paiement est mensuel et prélevé automatiquement à la date anniversaire de votre abonnément. En cas d'échec de paiement, votre accès sera suspendu après un délai de grâce de 3 jours.</p></Section>
      <Section n="6" title="Résiliation"><p>Vous pouvez résilier votre abonnément à tout moment depuis votre compte. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement partiel n'est effectué pour les jours non utilisés.</p></Section>
      <Section n="7" title="Propriété intellectuelle"><p>L'application Trackova, son code, son design, son logo et ses contenus sont la propriété exclusive de leurs créateurs. Toute reproduction ou utilisation non'autorisée est interdite.</p></Section>
      <Section n="8" title="Données utilisateur"><p>Vos tâches, objectifs et données de progression vous appartiennent. Vous pouvez les exportér ou les supprimer à tout moment.</p></Section>
      <Section n="9" title="Comportement interdit">
        <p>Il est interdit d'utiliser Trackova pour :</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>Contourner les mesures de sécurité</li>
          <li>Accéder aux données d'autres utilisateurs</li>
          <li>Utiliser des robots ou scripts automatisés</li>
          <li>Diffuser du contenu illégal ou offensant</li>
        </ul>
      </Section>
      <Section n="10" title="Limitation de responsabilité"><p>Trackova est fourni "tel quel". Nous ne pouvons être tenus responsables de pertes de données, d'interruptions de service ou de tout dommage indirect. Nous faisons notre maximum pour assurer une disponibilité de 99% du service.</p></Section>
      <Section n="11" title="Modifications du service"><p>Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment. En cas de changement tarifaire, vous serez informé au moins 30 jours à l'avance.</p></Section>
      <Section n="12" title="Droit applicable"><p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents français.</p></Section>
      <Section n="13" title="Contact"><p>Email : <span className="text-violet-400">contact@trackova.app</span><br/>Site : trackova.vercel.app</p></Section>
    </>
  )
}