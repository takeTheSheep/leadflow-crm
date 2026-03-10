export function followUpReminderEmail(params: { recipientName: string; companyName: string; dueDate: string }) {
  return {
    subject: `Follow-up due: ${params.companyName}`,
    html: `
      <h1>Follow-up Reminder</h1>
      <p>Hi ${params.recipientName},</p>
      <p>Your follow-up for <strong>${params.companyName}</strong> is due on ${params.dueDate}.</p>
      <p>Please update the lead status in LeadFlow CRM.</p>
    `,
  };
}

