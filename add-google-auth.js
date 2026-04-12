const fs = require('fs');
const file = 'src/components/AuthPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const googleIconCode = `

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
  </svg>
)
`;

content = content.replace('const QUESTIONS', googleIconCode + 'const QUESTIONS');

const handleGoogleCode = `

  const handleGoogleLogin = async () => {
    setError(""); setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }
`;

content = content.replace(
  'const goTo = (m) => { setMode(m); setError(""); setSuccess("") }',
  'const goTo = (m) => { setMode(m); setError(""); setSuccess("") }' + handleGoogleCode
);

const googleButtonCode = `{(mode === "login" || mode === "signup") && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-sm font-medium transition-all mb-4"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "#ffffff",
                  border: \`1px solid \${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}\`,
                  color: textPrimary,
                  boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)"
                }}>
                {loading ? <span className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /> : (
                  <>
                    <GoogleIcon />
                    <span>Continuer avec Google</span>
                  </>
                )}
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3" style={{ background: cardBg, color: textMuted }}>ou</span>
                </div>
              </div>
            </>
          )}
          `;

content = content.replace(
  '<form onSubmit={handleSubmit} className="space-y-4">',
  googleButtonCode + '<form onSubmit={handleSubmit} className="space-y-4">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Authentification Google ajoutée avec succès!');
