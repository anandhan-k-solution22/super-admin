// Development email sender: no external deps, avoids build/runtime issues
// Logs the reset link so you can copy it during development.

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    console.log('=== PASSWORD RESET EMAIL ===')
    console.log('To:', email)
    console.log('Subject: Reset Your Password - Acme Inc.')
    console.log('Reset Link:', resetLink)
    console.log('============================')

    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true, data: { id: 'dev-log-email' } }
  } catch (error) {
    console.error('Error sending email (dev logger):', error)
    return { success: false, error: 'Failed to send email' }
  }
}
