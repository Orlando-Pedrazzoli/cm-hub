// ============================================
// CM POLICY HUB - DECISION TREE
// Árvore de decisão completa para análise de conteúdo
// Baseada na tree real de decisões do workflow de moderação
// ============================================

// ============================================
// TYPES
// ============================================

export type ActionType = "no_action" | "escalate" | "label";

export interface DecisionNode {
  id: string;
  label: string;
  key?: string; // Keyboard shortcut (1, 2, 3, A, B, etc.)
  children?: DecisionNode[];
  isTerminal?: boolean;
  requiresContext?: boolean;
  contextQuestion?: string;
}

export interface DecisionPath {
  action: ActionType;
  path: string[];
  fullLabel: string;
  shortcut: string;
}

// ============================================
// PHASE 1: MAIN ACTION
// ============================================

export const MAIN_ACTIONS: DecisionNode[] = [
  { id: "no_action", label: "No Action", key: "1" },
  { id: "escalate", label: "Escalate", key: "2" },
  { id: "label", label: "Label", key: "3" },
];

// ============================================
// PHASE 1.1: NO ACTION SUB-DECISIONS
// ============================================

export const NO_ACTION_TREE: DecisionNode = {
  id: "no_action",
  label: "No Action",
  children: [
    { id: "no_action_benign", label: "No - No Action, Benign", key: "1", isTerminal: true },
    { id: "no_action_implicit_sex_children", label: "No Action, Implicit Sexualization of Children", key: "2", isTerminal: true },
    { id: "no_action_doi_context", label: "No - DOI Social & Political Discourse Context VII.-XII.", key: "3", isTerminal: true },
    { id: "no_action_missing_self_report", label: "No - No Action, Missing Self-Reporting (F/N match)", key: "4", isTerminal: true },
  ],
};

// ============================================
// PHASE 2: ESCALATE TREE
// ============================================

export const ESCALATE_TREE: DecisionNode = {
  id: "escalate",
  label: "Escalate",
  contextQuestion: "What should the content be escalated for?",
  children: [
    // Child Exploitation
    {
      id: "escalate_child_exploitation",
      label: "Child Exploitation",
      key: "1",
      contextQuestion: "What potential Child Exploitation do you want the content to be escalated for?",
      children: [
        { id: "escalate_ce_sextortion", label: "Sextortion", key: "1", isTerminal: true },
        { id: "escalate_ce_csam", label: "CSAM (photos, videos)", key: "2", isTerminal: true },
        { id: "escalate_ce_csam_links", label: "CSAM Links", key: "3", isTerminal: true },
        { id: "escalate_ce_soliciting", label: "Soliciting (Asking or Offering) Imagery", key: "4", isTerminal: true },
        { id: "escalate_ce_iic", label: "Inappropriate Interactions with Children (IIC)", key: "5", isTerminal: true },
        { id: "escalate_ce_imminent_threat", label: "Imminent Sexual Threat to Life or Safety", key: "6", isTerminal: true },
        { id: "escalate_ce_parent_content", label: "Escalate Parent Content", key: "7", isTerminal: true },
        { id: "escalate_ce_non_sexual_abuse", label: "Non-Sexual Child Abuse", key: "8", isTerminal: true },
      ],
    },
    // Human Trafficking
    {
      id: "escalate_human_trafficking",
      label: "Human Trafficking",
      key: "2",
      contextQuestion: "What do you want the content to be escalated for?",
      children: [
        { id: "escalate_ht_irt", label: "Imminent Threat to Life or Safety IRT", key: "1", isTerminal: true },
        { id: "escalate_ht_minor_sex", label: "Minor Sex Trafficking", key: "2", isTerminal: true },
        { id: "escalate_ht_sex", label: "Sex Trafficking", key: "3", isTerminal: true },
        { id: "escalate_ht_ccsa", label: "Coordinated Commercial Sexual Activity", key: "4", isTerminal: true },
        { id: "escalate_ht_organ", label: "Organ Trafficking", key: "5", isTerminal: true },
        { id: "escalate_ht_other", label: "Other Trafficking", key: "6", isTerminal: true },
      ],
    },
    // Human Smuggling
    {
      id: "escalate_human_smuggling",
      label: "Human Smuggling",
      key: "3",
      contextQuestion: "What do you want the content to be escalated for?",
      children: [
        { id: "escalate_hs_irt", label: "Imminent Threat to Life or Safety IRT", key: "1", isTerminal: true },
      ],
    },
    // Threatening
    {
      id: "escalate_threatening",
      label: "Threatening",
      key: "4",
      contextQuestion: "What Exactly?",
      children: [
        { id: "escalate_threat_doi", label: "Threatening - Dangerous Individuals and Orgs", key: "1", isTerminal: true },
        { id: "escalate_threat_other", label: "Threatening - Other", key: "2", isTerminal: true },
        { id: "escalate_threat_rape", label: "Threatening - Potentially Credible Rape", key: "3", isTerminal: true },
      ],
    },
    // Suicide
    {
      id: "escalate_suicide",
      label: "Suicide",
      key: "5",
      contextQuestion: "What exactly?",
      children: [
        { id: "escalate_suicide_graphic", label: "Graphic/Promotion", key: "1", isTerminal: true },
        { id: "escalate_suicide_admission", label: "Admission", key: "3", isTerminal: true },
      ],
    },
  ],
};

// ============================================
// PHASE 3: LABEL TREE (25 Categories)
// ============================================

export const LABEL_TREE: DecisionNode = {
  id: "label",
  label: "Label",
  contextQuestion: "What Abuse Type?",
  children: [
    // 1. SSIED
    {
      id: "label_ssied",
      label: "Suicide, Self-Injury & Eating Disorders",
      key: "1",
      contextQuestion: "Which Sub-Harm of SSIED?",
      children: [
        {
          id: "label_ssied_suicide",
          label: "Suicide",
          contextQuestion: "What Suicide abuse type is present?",
          children: [
            { id: "label_ssied_suicide_promotion", label: "Promotion", key: "1", isTerminal: true },
            { id: "label_ssied_suicide_graphic", label: "Graphic Content", key: "2", isTerminal: true },
            { id: "label_ssied_suicide_mocking", label: "Mocking", key: "3", isTerminal: true },
            { id: "label_ssied_suicide_admission", label: "Admission", key: "4", isTerminal: true },
            { id: "label_ssied_suicide_reference", label: "Suicide Reference or Narratives", key: "5", isTerminal: true },
          ],
        },
        {
          id: "label_ssied_self_injury",
          label: "Self-Injury",
          contextQuestion: "What Exactly?",
          children: [
            { id: "label_ssied_si_promotion", label: "Promotion", key: "1", isTerminal: true },
            { id: "label_ssied_si_graphic", label: "Graphic Content", key: "2", isTerminal: true },
            { id: "label_ssied_si_mocking", label: "Mocking", key: "3", isTerminal: true },
            { id: "label_ssied_si_admission", label: "Admission", key: "4", isTerminal: true },
            { id: "label_ssied_si_reference", label: "Self-Injury Reference or Narratives", key: "5", isTerminal: true },
          ],
        },
        {
          id: "label_ssied_eating_disorder",
          label: "Eating Disorder",
          contextQuestion: "Is there any Eating Disorder (ED) context present?",
          children: [
            {
              id: "label_ssied_ed_yes",
              label: "Yes",
              contextQuestion: "What Eating Disorder abuse type is present?",
              children: [
                { id: "label_ssied_ed_yes_promotion", label: "Promotion", key: "1", isTerminal: true },
                { id: "label_ssied_ed_yes_graphic", label: "Graphic Content", key: "2", isTerminal: true },
                { id: "label_ssied_ed_yes_mocking", label: "Mocking", key: "3", isTerminal: true },
                { id: "label_ssied_ed_yes_admission", label: "Admission", key: "4", isTerminal: true },
                { id: "label_ssied_ed_yes_recovery", label: "Recovery", key: "5", isTerminal: true },
              ],
            },
            {
              id: "label_ssied_ed_no",
              label: "No",
              contextQuestion: "What content is presented?",
              children: [
                { id: "label_ssied_ed_no_promotion", label: "Promotion", key: "1", isTerminal: true },
                { id: "label_ssied_ed_no_graphic", label: "Graphic Content", key: "2", isTerminal: true },
                { id: "label_ssied_ed_no_admission", label: "Admission", key: "3", isTerminal: true },
                { id: "label_ssied_ed_no_others", label: "Others", key: "4", isTerminal: true },
              ],
            },
          ],
        },
      ],
    },

    // 2. Child Exploitation
    {
      id: "label_child_exploitation",
      label: "Child Exploitation",
      key: "2",
      contextQuestion: "What Child Exploitation exactly?",
      children: [
        {
          id: "label_ce_solicitation",
          label: "Content Solicitation",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_ce_sol_non_real", label: "Nude or sexualized imagery of Non-real children", key: "1", isTerminal: true },
          ],
        },
        {
          id: "label_ce_explicit_sex",
          label: "Explicit Sexualization of Children",
          contextQuestion: "What exactly?",
          children: [
            {
              id: "label_ce_sex_imagery",
              label: "Sexualized Imagery of Children",
              contextQuestion: "What exactly?",
              children: [
                { id: "label_ce_sex_img_dancing", label: "Sexualized movements or dancing", key: "1", isTerminal: true },
                { id: "label_ce_sex_img_ai", label: "Edited, manipulated AI-generated sexualized content", key: "2", isTerminal: true },
                { id: "label_ce_sex_img_focus", label: "Focus on commonly sexualized body part", key: "3", isTerminal: true },
                { id: "label_ce_sex_img_near_nude", label: "Near nude in sexually suggestive pose", key: "4", isTerminal: true },
              ],
            },
            { id: "label_ce_sex_text", label: "Sexualized Text about children", isTerminal: true },
          ],
        },
        {
          id: "label_ce_cse",
          label: "Child Sexual Exploitation (non-real minors, sexual fetish, pedophilia, other)",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_ce_cse_non_real", label: "Non-real child sexual exploitation imagery", key: "1", isTerminal: true },
            { id: "label_ce_cse_identify", label: "Identifying or mocking an alleged victim of child sexual exploitation", key: "2", isTerminal: true },
            { id: "label_ce_cse_pedo", label: "Content supporting/promoting Pedophilia", key: "3", isTerminal: true },
            { id: "label_ce_cse_fetish", label: "Sexual fetish", key: "4", isTerminal: true },
            { id: "label_ce_cse_other", label: "Other", key: "5", isTerminal: true },
          ],
        },
        {
          id: "label_ce_non_sexual_abuse",
          label: "Non-Sexual Child Abuse",
          contextQuestion: "What Non-Sexual Child Abuse exactly?",
          children: [
            { id: "label_ce_nsa_police", label: "Videos or photos that depict police officers or military personnel committing non-sexual child abuse", key: "1", isTerminal: true },
            { id: "label_ce_nsa_water", label: "Videos or photos of violent immersion of a child in water in the context of religious rituals", key: "2", isTerminal: true },
            { id: "label_ce_nsa_other", label: "Other", key: "3", isTerminal: true },
          ],
        },
      ],
    },

    // 3. Human Exploitation
    {
      id: "label_human_exploitation",
      label: "Human Exploitation",
      key: "3",
      contextQuestion: "What exactly?",
      children: [
        {
          id: "label_he_trafficking",
          label: "Human Trafficking",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_he_ht_child_sell", label: "Child Selling and/or Illegal Adoption", key: "1", isTerminal: true },
            { id: "label_he_ht_soldiers", label: "Child soldiers", key: "2", isTerminal: true },
            { id: "label_he_ht_labor_exploit", label: "Labor Exploitation", key: "3", isTerminal: true },
            { id: "label_he_ht_labor_abuse", label: "Labor Abuse", key: "4", isTerminal: true },
            { id: "label_he_ht_domestic", label: "Domestic Servitude", key: "5", isTerminal: true },
            { id: "label_he_ht_helpers", label: "Domestic Helpers", key: "6", isTerminal: true },
            { id: "label_he_ht_marriage", label: "Temporary Marriages", key: "7", isTerminal: true },
          ],
        },
        {
          id: "label_he_smuggling",
          label: "Human Smuggling",
          contextQuestion: "What Exactly?",
          children: [
            { id: "label_he_hs_facilitate", label: "Facilitate/Offer to provide services", key: "1", isTerminal: true },
            { id: "label_he_hs_asks", label: "Asks for services", key: "2", isTerminal: true },
            { id: "label_he_hs_safety", label: "Personal safety and border crossing, seeking asylum", key: "3", isTerminal: true },
          ],
        },
      ],
    },

    // 4. RGS - Drugs and Pharmaceuticals
    {
      id: "label_drugs",
      label: "RGS - Drugs and Pharmaceuticals",
      key: "4",
      contextQuestion: "What abuse type do you see?",
      children: [
        {
          id: "label_drugs_high_risk",
          label: "High-Risk Drugs",
          key: "1",
          contextQuestion: "In what context?",
          children: [
            {
              id: "label_drugs_hr_bst",
              label: "Buy/Sell/Trade",
              key: "1",
              contextQuestion: "Do you see any high risk signals? (price or quantity or contact info or drug dealer context)",
              children: [
                { id: "label_drugs_hr_bst_yes", label: "Yes", key: "1", isTerminal: true },
                { id: "label_drugs_hr_bst_no", label: "No", key: "2", isTerminal: true },
              ],
            },
            { id: "label_drugs_hr_admission", label: "Admission/Consumption/Promotion", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_drugs_non_medical",
          label: "Non-Medical Drugs",
          key: "2",
          contextQuestion: "In what context?",
          children: [
            {
              id: "label_drugs_nm_bst",
              label: "Buy/Sell/Trade",
              contextQuestion: "Do you see any high risk signals? (price or quantity or contact info or drug dealer context)",
              children: [
                { id: "label_drugs_nm_bst_yes", label: "Yes", key: "1", isTerminal: true },
                { id: "label_drugs_nm_bst_no", label: "No", key: "2", isTerminal: true },
              ],
            },
            {
              id: "label_drugs_nm_admission",
              label: "Admission/Consumption/Promotion",
              contextQuestion: "Is this in a recovery context?",
              children: [
                { id: "label_drugs_nm_adm_yes", label: "Yes", key: "1", isTerminal: true },
                { id: "label_drugs_nm_adm_no", label: "No", key: "2", isTerminal: true },
              ],
            },
          ],
        },
        {
          id: "label_drugs_entheogen",
          label: "Entheogen Drugs",
          key: "3",
          contextQuestion: "In what context?",
          children: [
            { id: "label_drugs_enth_bst", label: "Buy/Sell/Trade", key: "1", isTerminal: true },
            { id: "label_drugs_enth_admission", label: "Admission/Consumption/Promotion", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_drugs_prescription",
          label: "Prescription Drugs, Over-the-Counter Drugs",
          key: "4",
          contextQuestion: "What kind of drugs?",
          children: [
            {
              id: "label_drugs_rx",
              label: "Prescription Drugs",
              contextQuestion: "What exactly?",
              children: [
                { id: "label_drugs_rx_sale", label: "Sale", key: "1", isTerminal: true },
                { id: "label_drugs_rx_admission", label: "Admission / Consumption", key: "2", isTerminal: true },
                { id: "label_drugs_rx_promotion", label: "Promotion", key: "3", isTerminal: true },
                { id: "label_drugs_rx_news", label: "News / PSA", key: "4", isTerminal: true },
              ],
            },
            {
              id: "label_drugs_otc",
              label: "Over-the-Counter Drugs and Animal Medicines",
              contextQuestion: "What exactly?",
              children: [
                { id: "label_drugs_otc_sale", label: "OTC Sale", key: "1", isTerminal: true },
                { id: "label_drugs_otc_animal", label: "Animal Medications Sale", key: "2", isTerminal: true },
              ],
            },
          ],
        },
        {
          id: "label_drugs_cannabis",
          label: "Cannabis and Cannabis Derived Products",
          key: "5",
          contextQuestion: "What type of Cannabis?",
          children: [
            {
              id: "label_drugs_thc",
              label: "Marijuana / THC",
              key: "1",
              contextQuestion: "What exactly is shown?",
              children: [
                { id: "label_drugs_thc_sale", label: "Sale", key: "1", isTerminal: true },
                { id: "label_drugs_thc_promo", label: "Promotion / Marijuana Dispensary / Paraphernalia", key: "2", isTerminal: true },
                { id: "label_drugs_thc_fiction", label: "Fictional or Documentary", key: "3", isTerminal: true },
              ],
            },
            {
              id: "label_drugs_cbd",
              label: "CBD",
              key: "2",
              contextQuestion: "Is it an ingestible?",
              children: [
                { id: "label_drugs_cbd_yes", label: "Yes", key: "1", isTerminal: true },
                { id: "label_drugs_cbd_no", label: "No", key: "2", isTerminal: true },
              ],
            },
            {
              id: "label_drugs_hemp",
              label: "Hemp",
              key: "3",
              contextQuestion: "Is there a disease claim?",
              children: [
                { id: "label_drugs_hemp_yes", label: "Yes", key: "1", isTerminal: true },
                { id: "label_drugs_hemp_no", label: "No", key: "2", isTerminal: true },
              ],
            },
          ],
        },
        {
          id: "label_drugs_addiction",
          label: "Addiction Treatment",
          key: "6",
          contextQuestion: "What type of treatment?",
          children: [
            { id: "label_drugs_add_drug_alcohol", label: "Drug & Alcohol Addiction Treatment", key: "1", isTerminal: true },
            { id: "label_drugs_add_other", label: "Other Rehabilitation (Not Alcohol or Drugs)", key: "2", isTerminal: true },
          ],
        },
      ],
    },

    // 5. Dangerous Orgs and Individuals
    {
      id: "label_doi",
      label: "Dangerous Orgs and Individuals",
      key: "5",
      contextQuestion: "What exactly?",
      children: [
        {
          id: "label_doi_terrorism",
          label: "Terrorism",
          key: "1",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_doi_terr_support", label: "Representation, Glorification, or Support", key: "1", isTerminal: true },
            { id: "label_doi_terr_ref", label: "References", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_doi_hate",
          label: "Hate Organizations and Individuals",
          key: "2",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_doi_hate_support", label: "Representation, Glorification, or Support", key: "1", isTerminal: true },
            { id: "label_doi_hate_ref", label: "References", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_doi_criminal",
          label: "Criminal Organizations",
          key: "3",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_doi_crim_support", label: "Representation, Glorification, or Support", key: "1", isTerminal: true },
            { id: "label_doi_crim_ref", label: "References", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_doi_violent_events",
          label: "Violating Violent Events",
          key: "4",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_doi_vve_support", label: "Representation, Glorification, or Support", key: "1", isTerminal: true },
            { id: "label_doi_vve_ref", label: "References", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_doi_vnsa",
          label: "VNSA and VIE",
          key: "5",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_doi_vnsa_support", label: "Representation, Glorification, or Material Support", key: "1", isTerminal: true },
            { id: "label_doi_vnsa_ref", label: "References or Other Support", key: "2", isTerminal: true },
          ],
        },
        { id: "label_doi_social", label: "Social & Political Discourse Context I.-VI.", key: "6", isTerminal: true },
      ],
    },

    // 6. Adult Sexual Exploitation
    {
      id: "label_ase",
      label: "Adult Sexual Exploitation",
      key: "6",
      contextQuestion: "What Adult Exploitation exactly?",
      children: [
        {
          id: "label_ase_ncii_sextortion",
          label: "NCII for Sextortion",
          key: "1",
          contextQuestion: "What is depicted?",
          children: [
            { id: "label_ase_ncii_sext_nudity", label: "Nudity OR Sexual Activity", key: "1", isTerminal: true },
            { id: "label_ase_ncii_sext_near", label: "Near Nudity/Sexually suggestive pose", key: "2", isTerminal: true },
            { id: "label_ase_ncii_sext_threat", label: "Threats to share OR Solicitation", key: "3", isTerminal: true },
          ],
        },
        {
          id: "label_ase_ncii_harassment",
          label: "NCII for Harassment",
          key: "2",
          contextQuestion: "What is depicted?",
          children: [
            { id: "label_ase_ncii_harass_nudity", label: "Nudity OR Sexual Activity", key: "1", isTerminal: true },
            { id: "label_ase_ncii_harass_near", label: "Near Nudity/Sexually suggestive pose", key: "2", isTerminal: true },
            { id: "label_ase_ncii_harass_threat", label: "Threats to share OR Solicitation", key: "3", isTerminal: true },
          ],
        },
        { id: "label_ase_ncii_sensational", label: "NCII Sensationalist", key: "3", isTerminal: true },
        { id: "label_ase_ncii_services", label: "NCII Services", key: "4", isTerminal: true },
        {
          id: "label_ase_ncst",
          label: "NCST",
          key: "5",
          contextQuestion: "What NCST Exactly?",
          children: [
            { id: "label_ase_ncst_rape_threat", label: "NCST Rape Threat", key: "1", isTerminal: true },
            { id: "label_ase_ncst_imagery", label: "NCST Imagery", key: "2", isTerminal: true },
            { id: "label_ase_ncst_text", label: "NCST Text", key: "3", isTerminal: true },
            { id: "label_ase_ncst_vosa", label: "Identifying Victims of Sexual Assault (VOSA)", key: "4", isTerminal: true },
            { id: "label_ase_ncst_awareness", label: "NCST Awareness", key: "5", isTerminal: true },
          ],
        },
        { id: "label_ase_creepshot", label: "Creepshot", key: "6", isTerminal: true },
        { id: "label_ase_forced_stripping", label: "Forced Stripping or Necrophilia", key: "7", isTerminal: true },
      ],
    },

    // 7. Prostitution / Adult Sexual Solicitation and Sexually Explicit Language
    {
      id: "label_sspx",
      label: "Prostitution / Adult Sexual Solicitation and Sexually Explicit Language",
      key: "7",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_sspx_prostitution", label: "Prostitution", key: "1", isTerminal: true },
        { id: "label_sspx_solicitation", label: "Sexual Solicitation", key: "2", isTerminal: true },
        {
          id: "label_sspx_porn",
          label: "Pornography and Adult Websites",
          key: "3",
          contextQuestion: "What Exactly?",
          children: [
            { id: "label_sspx_porn_ask", label: "Ask/Offer/Interaction information for Pornographic material", key: "1", isTerminal: true },
            { id: "label_sspx_porn_links", label: "Contains usernames, links to Pornographic Websites", key: "2", isTerminal: true },
            { id: "label_sspx_porn_subs", label: "Contains usernames, links to, or logos of Adult Subscription Websites", key: "3", isTerminal: true },
          ],
        },
        {
          id: "label_sspx_language",
          label: "Sexualized Language",
          key: "4",
          contextQuestion: "What Exactly?",
          children: [
            { id: "label_sspx_lang_explicit", label: "Sexually Explicit Language", key: "1", isTerminal: true },
            { id: "label_sspx_lang_suggestive", label: "Sexually Suggestive Language", key: "2", isTerminal: true },
            { id: "label_sspx_lang_commentary", label: "Sexual Commentary", key: "3", isTerminal: true },
            { id: "label_sspx_lang_desire", label: "Content expressing desire for sexual activity", key: "4", isTerminal: true },
          ],
        },
      ],
    },

    // 8. Child Nudity
    {
      id: "label_child_nudity",
      label: "Child Nudity",
      key: "8",
      contextQuestion: "Select the most relevant category",
      children: [
        {
          id: "label_cn_sexualization",
          label: "Child Nudity with Sexualization of Children",
          key: "1",
          contextQuestion: "What Child Exploitation exactly?",
          children: [
            { id: "label_cn_sex_solicitation", label: "Content Solicitation", key: "1", isTerminal: true },
            { id: "label_cn_sex_explicit", label: "Explicit Sexualization of Children", key: "2", isTerminal: true },
            { id: "label_cn_sex_cse", label: "Child Sexual Exploitation (non-real minors, sexual fetish, pedophilia, other)", key: "3", isTerminal: true },
            { id: "label_cn_sex_abuse", label: "Non-Sexual Child Abuse", key: "4", isTerminal: true },
          ],
        },
        {
          id: "label_cn_minor",
          label: "Child Nudity of Real/Non-Real Minor (4 - less than 18 years old)",
          key: "2",
          contextQuestion: "What Child Nudity exactly?",
          children: [
            { id: "label_cn_minor_genitalia", label: "Visible genitalia (even when covered or obscured by transparent clothing)", key: "1", isTerminal: true },
            { id: "label_cn_minor_anus", label: "Visible anus and/or fully nude close-up of buttocks", key: "2", isTerminal: true },
            { id: "label_cn_minor_nipples", label: "Uncovered Female nipples", key: "3", isTerminal: true },
            { id: "label_cn_minor_no_clothes", label: "No clothes present from neck to knee (even if no genitalia/nipples are showing)", key: "4", isTerminal: true },
            { id: "label_cn_minor_implied", label: "Implied nudity where there is at least one piece of clothing between neck and knees", key: "5", isTerminal: true },
          ],
        },
        {
          id: "label_cn_toddler",
          label: "Child Nudity of Real/Non-Real Toddler (1.5 - less than 4 years old)",
          key: "3",
          contextQuestion: "What Child Nudity exactly?",
          children: [
            { id: "label_cn_toddler_genitalia", label: "Visible genitalia (even when covered or obscured by transparent clothing)", key: "1", isTerminal: true },
            { id: "label_cn_toddler_anus", label: "Visible anus and/or fully nude close-up of buttocks", key: "2", isTerminal: true },
            { id: "label_cn_toddler_nipples", label: "Female nipples of toddler", key: "3", isTerminal: true },
            { id: "label_cn_toddler_buttocks", label: "Long-shots of fully nude buttocks", key: "4", isTerminal: true },
            { id: "label_cn_toddler_implied", label: "Implied nudity (under-clothed or no clothes between knees and neck AND no genitalia visible)", key: "5", isTerminal: true },
          ],
        },
        {
          id: "label_cn_baby",
          label: "Child Nudity of Real/Non-Real Baby (0 - 1.5 years old)",
          key: "4",
          contextQuestion: "What Child Nudity exactly?",
          children: [
            { id: "label_cn_baby_genitalia", label: "Close-ups of genitalia", key: "1", isTerminal: true },
          ],
        },
        {
          id: "label_cn_art",
          label: "Real-world Art of Child Nudity",
          key: "5",
          contextQuestion: "What is the context?",
          children: [
            { id: "label_cn_art_sexual", label: "Depicting any kind of sexual activity, sexual elements, or having sexual context", key: "1", isTerminal: true },
            { id: "label_cn_art_health", label: "Health or other context", key: "2", isTerminal: true },
          ],
        },
        { id: "label_cn_non_real_health", label: "Non-Real Imagery of Child Nudity in a Health Context", key: "6", isTerminal: true },
      ],
    },

    // 9. Violent and Graphic Content
    {
      id: "label_vgc",
      label: "Violent and Graphic Content",
      key: "9",
      contextQuestion: "What is displayed?",
      children: [
        {
          id: "label_vgc_sadistic",
          label: "Sadistic Remarks",
          key: "1",
          contextQuestion: "What is the context?",
          children: [
            { id: "label_vgc_sadistic_medical", label: "Medical, self-defense or DOI context", key: "1", isTerminal: true },
            { id: "label_vgc_sadistic_other", label: "Any other context", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_vgc_mutilated",
          label: "Mutilated Humans",
          key: "2",
          contextQuestion: "What type of content?",
          children: [
            {
              id: "label_vgc_mut_video",
              label: "In video",
              contextQuestion: "What specifically?",
              children: [
                { id: "label_vgc_mut_vid_dismember", label: "Dismemberment", key: "1", isTerminal: true },
                { id: "label_vgc_mut_vid_burned", label: "Severely Burned or Charred", key: "2", isTerminal: true },
                { id: "label_vgc_mut_vid_throat", label: "Throat Slitting", key: "3", isTerminal: true },
                { id: "label_vgc_mut_vid_innards", label: "Visible Innards", key: "4", isTerminal: true },
              ],
            },
            {
              id: "label_vgc_mut_photo",
              label: "In photo",
              contextQuestion: "What specifically?",
              children: [
                { id: "label_vgc_mut_photo_dismember", label: "Dismemberment", key: "1", isTerminal: true },
                { id: "label_vgc_mut_photo_burned", label: "Severely Burned or Charred", key: "2", isTerminal: true },
                { id: "label_vgc_mut_photo_throat", label: "Throat Slitting", key: "3", isTerminal: true },
                { id: "label_vgc_mut_photo_innards", label: "Visible Innards", key: "4", isTerminal: true },
              ],
            },
          ],
        },
        {
          id: "label_vgc_violence",
          label: "Violence, Brutality and Capital Punishment",
          key: "3",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_vgc_viol_capital", label: "Live-streams of Capital Punishment", key: "1", isTerminal: true },
            { id: "label_vgc_viol_death", label: "Violent Death or Life-Threatening Event", key: "2", isTerminal: true },
            { id: "label_vgc_viol_brutality", label: "Brutality", key: "3", isTerminal: true },
          ],
        },
        {
          id: "label_vgc_gore",
          label: "Human Gore",
          key: "4",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_vgc_gore_pierce", label: "Non-medical objects piercing the skin", key: "1", isTerminal: true },
            { id: "label_vgc_gore_teeth", label: "Bleeding gums and teeth", key: "2", isTerminal: true },
            { id: "label_vgc_gore_waste", label: "Human Waste and Bodily Fluids", key: "3", isTerminal: true },
            { id: "label_vgc_gore_dead", label: "Dead body is partially or fully uncovered", key: "4", isTerminal: true },
            { id: "label_vgc_gore_historical", label: "Graphic Historical Imagery", key: "5", isTerminal: true },
          ],
        },
        {
          id: "label_vgc_dead_babies",
          label: "Dead Babies and Fetus",
          key: "5",
          contextQuestion: "What is the context?",
          children: [
            { id: "label_vgc_dead_head", label: "Head of another person is visible", key: "1", isTerminal: true },
            { id: "label_vgc_dead_other", label: "Any other context", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_vgc_medical",
          label: "Human Medical",
          key: "6",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_vgc_med_needles", label: "Needles piercing the skin", key: "1", isTerminal: true },
            { id: "label_vgc_med_injured", label: "Injured Human in a medical context", key: "2", isTerminal: true },
          ],
        },
        {
          id: "label_vgc_armament",
          label: "Armament",
          key: "7",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_vgc_arm_viewer", label: "Armament pointed at the viewer", key: "1", isTerminal: true },
            { id: "label_vgc_arm_person", label: "Armament pointed at another person", key: "2", isTerminal: true },
          ],
        },
        { id: "label_vgc_vehicle", label: "Graphic Vehicle Damage", key: "8", isTerminal: true },
        {
          id: "label_vgc_animal",
          label: "Animal",
          key: "9",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_vgc_animal_mutilated", label: "Mutilated Animals", key: "1", isTerminal: true },
            { id: "label_vgc_animal_live_dead", label: "Animals going from live to dead (no dismemberment)", key: "2", isTerminal: true },
            { id: "label_vgc_animal_brutality", label: "Brutality against an animal", key: "3", isTerminal: true },
            { id: "label_vgc_animal_birth", label: "Birthing Context", key: "4", isTerminal: true },
            { id: "label_vgc_animal_blood", label: "Animal with visible blood", key: "5", isTerminal: true },
            { id: "label_vgc_animal_insects", label: "Animals with insects coming out of them", key: "6", isTerminal: true },
            { id: "label_vgc_animal_suffering", label: "Live Animal Suffering", key: "7", isTerminal: true },
          ],
        },
        {
          id: "label_vgc_fictional",
          label: "Recognized Fictional Graphic Imagery",
          key: "0",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_vgc_fict_mutilated", label: "Mutilated Humans", key: "1", isTerminal: true },
            { id: "label_vgc_fict_photo_human", label: "Photorealistic graphic imagery of humans (except mutilation)", key: "2", isTerminal: true },
            { id: "label_vgc_fict_arm", label: "Photorealistic armament pointed at the viewer", key: "3", isTerminal: true },
            { id: "label_vgc_fict_animal", label: "Photorealistic graphic imagery of animals", key: "4", isTerminal: true },
          ],
        },
      ],
    },

    // 0. Adult Nudity and Sexual Activity
    {
      id: "label_ansa",
      label: "Adult Nudity and Sexual Activity",
      key: "0",
      contextQuestion: "What type of content?",
      children: [
        {
          id: "label_ansa_photo",
          label: "Photorealistic imagery",
          key: "1",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_ansa_photo_explicit", label: "Explicit sexual activity or stimulation", key: "1", isTerminal: true },
            { id: "label_ansa_photo_implicit", label: "Implicit sexual activity or stimulation", key: "2", isTerminal: true },
            { id: "label_ansa_photo_other_activity", label: "Other sexual activity or stimulation", key: "3", isTerminal: true },
            { id: "label_ansa_photo_fetish", label: "Fetish", key: "4", isTerminal: true },
            { id: "label_ansa_photo_audio_long", label: "Sexual audio (10 seconds or longer)", key: "5", isTerminal: true },
            { id: "label_ansa_photo_genitalia", label: "Visible genitalia, anuses, or visible buttocks", key: "6", isTerminal: true },
            { id: "label_ansa_photo_nipples", label: "Visible female nipples", key: "7", isTerminal: true },
            { id: "label_ansa_photo_focus_no_aware", label: "Videos that focus on crotch, buttocks or female breasts recorded without PDITI's awareness", key: "8", isTerminal: true },
            { id: "label_ansa_photo_pose_near", label: "Sexually suggestive pose AND near nudity", key: "9", isTerminal: true },
            { id: "label_ansa_photo_pose_focus", label: "Sexually suggestive pose AND the focus of the image is crotch or buttocks", key: "0", isTerminal: true },
            { id: "label_ansa_photo_near_nudity", label: "Near nudity", key: "A", isTerminal: true },
            { id: "label_ansa_photo_focus", label: "Crotch, buttocks, or female breasts) are the focus of the image", key: "B", isTerminal: true },
            { id: "label_ansa_photo_sex_related", label: "Sex-related activity", key: "C", isTerminal: true },
            { id: "label_ansa_photo_simulating", label: "Simulating sexual activity", key: "D", isTerminal: true },
            { id: "label_ansa_photo_gestures", label: "Gestures that signify genitalia, masturbation, oral sex, or sexual intercourse", key: "E", isTerminal: true },
            { id: "label_ansa_photo_logos", label: "Logos, screenshots, or video clips of known pornographic websites", key: "F", isTerminal: true },
            { id: "label_ansa_photo_audio_short", label: "Sexual audio (less than 10 seconds)", key: "G", isTerminal: true },
            { id: "label_ansa_photo_pose", label: "Sexually suggestive pose", key: "H", isTerminal: true },
            { id: "label_ansa_photo_animals", label: "Animals engaged in sexual activity, or when their genitals are visible", key: "I", isTerminal: true },
            { id: "label_ansa_photo_stripping", label: "Stripping or passive stripping", key: "J", isTerminal: true },
            { id: "label_ansa_photo_revealing", label: "PDITI wearing revealing clothing", key: "K", isTerminal: true },
            { id: "label_ansa_photo_touching", label: "Sexually touching or moving commonly sexualized body parts", key: "L", isTerminal: true },
            { id: "label_ansa_photo_topless_back", label: "Topless female depicted from the back", key: "M", isTerminal: true },
          ],
        },
        {
          id: "label_ansa_digital",
          label: "Digital imagery",
          key: "2",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_ansa_digital_explicit", label: "Explicit sexual activity or stimulation", key: "1", isTerminal: true },
            { id: "label_ansa_digital_implicit", label: "Implicit sexual activity or stimulation", key: "2", isTerminal: true },
            { id: "label_ansa_digital_other", label: "Other sexual activity or stimulation", key: "3", isTerminal: true },
            { id: "label_ansa_digital_fetish", label: "Fetish", key: "4", isTerminal: true },
            { id: "label_ansa_digital_audio_long", label: "Sexual audio (10 seconds or longer)", key: "5", isTerminal: true },
            { id: "label_ansa_digital_genitalia", label: "Visible genitalia, anuses, or visible buttocks", key: "6", isTerminal: true },
            { id: "label_ansa_digital_nipples", label: "Visible female nipples", key: "7", isTerminal: true },
            { id: "label_ansa_digital_focus_no_aware", label: "Videos that focus on crotch, buttocks or female breasts recorded without PDITI's awareness", key: "8", isTerminal: true },
            { id: "label_ansa_digital_pose_near", label: "Sexually suggestive pose AND near nudity", key: "9", isTerminal: true },
            { id: "label_ansa_digital_pose_focus", label: "Sexually suggestive pose AND the focus of the image is crotch or buttocks", key: "0", isTerminal: true },
            { id: "label_ansa_digital_near_nudity", label: "Near nudity", key: "A", isTerminal: true },
            { id: "label_ansa_digital_focus", label: "Crotch, buttocks, or female breasts) is the focus of the image", key: "B", isTerminal: true },
            { id: "label_ansa_digital_sex_related", label: "Sex-related activity", key: "C", isTerminal: true },
            { id: "label_ansa_digital_simulating", label: "Simulating sexual activity", key: "D", isTerminal: true },
            { id: "label_ansa_digital_gestures", label: "Gestures that signify genitalia, masturbation, oral sex, or sexual intercourse", key: "E", isTerminal: true },
            { id: "label_ansa_digital_logos", label: "Logos, screenshots, or video clips of known pornographic websites", key: "F", isTerminal: true },
            { id: "label_ansa_digital_audio_short", label: "Sexual audio (less than 10 seconds)", key: "G", isTerminal: true },
            { id: "label_ansa_digital_pose", label: "Sexually suggestive pose", key: "H", isTerminal: true },
            { id: "label_ansa_digital_animals", label: "Animals engaged in sexual activity, or when their genitals are visible", key: "I", isTerminal: true },
            { id: "label_ansa_digital_stripping", label: "Stripping or passive stripping", key: "J", isTerminal: true },
            { id: "label_ansa_digital_revealing", label: "PDITI wearing revealing clothing", key: "K", isTerminal: true },
            { id: "label_ansa_digital_touching", label: "Sexually touching or moving commonly sexualized body parts", key: "L", isTerminal: true },
            { id: "label_ansa_digital_topless_back", label: "Topless female depicted from the back", key: "M", isTerminal: true },
          ],
        },
        {
          id: "label_ansa_art",
          label: "Real world art",
          key: "3",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_ansa_art_explicit", label: "Explicit sexual activity or stimulation", key: "1", isTerminal: true },
            { id: "label_ansa_art_implicit", label: "Implicit sexual activity or stimulation", key: "2", isTerminal: true },
            { id: "label_ansa_art_other", label: "Other sexual activity or stimulation", key: "3", isTerminal: true },
            { id: "label_ansa_art_fetish", label: "Fetish", key: "4", isTerminal: true },
            { id: "label_ansa_art_audio_long", label: "Sexual audio (10 seconds or longer)", key: "5", isTerminal: true },
            { id: "label_ansa_art_genitalia", label: "Visible genitalia, anuses, or visible buttocks", key: "6", isTerminal: true },
            { id: "label_ansa_art_nipples", label: "Visible female nipples", key: "7", isTerminal: true },
            { id: "label_ansa_art_pose_near", label: "Sexually suggestive pose AND near nudity", key: "8", isTerminal: true },
            { id: "label_ansa_art_pose_focus", label: "Sexually suggestive pose AND the focus of the image is crotch or buttocks", key: "9", isTerminal: true },
            { id: "label_ansa_art_near_nudity", label: "Near nudity", key: "0", isTerminal: true },
            { id: "label_ansa_art_focus", label: "Crotch, buttocks, or female breasts) are the focus of the image", key: "A", isTerminal: true },
            { id: "label_ansa_art_sex_related", label: "Sex-related activity", key: "B", isTerminal: true },
            { id: "label_ansa_art_simulating", label: "Simulating sexual activity", key: "C", isTerminal: true },
            { id: "label_ansa_art_gestures", label: "Gestures that signify genitalia, masturbation, oral sex, or sexual intercourse", key: "D", isTerminal: true },
            { id: "label_ansa_art_logos", label: "Logos, screenshots, or video clips of known pornographic websites", key: "E", isTerminal: true },
            { id: "label_ansa_art_audio_short", label: "Sexual audio (less than 10 seconds)", key: "F", isTerminal: true },
            { id: "label_ansa_art_animals", label: "Animals engaged in sexual activity, or when their genitals are visible", key: "G", isTerminal: true },
            { id: "label_ansa_art_pose", label: "Sexually suggestive pose", key: "H", isTerminal: true },
          ],
        },
      ],
    },

    // A. RGS - Weapons, Ammunition, Explosives
    {
      id: "label_weapons",
      label: "RGS - Weapons, Ammunition, Explosives",
      key: "A",
      contextQuestion: "What context?",
      children: [
        {
          id: "label_weapons_commercial",
          label: "Commercial Intent or Discussion/ Advocacy",
          key: "1",
          contextQuestion: "What kind of weapons?",
          children: [
            { id: "label_weapons_com_machine", label: "Machine gun conversion device OR 3D printing OR computer-aided manufacturing instructions", key: "1", isTerminal: true },
            { id: "label_weapons_com_firearms", label: "Firearms / Explosives / Lethal Accessories / Firearm Parts", key: "2", isTerminal: true },
            { id: "label_weapons_com_bladed", label: "Bladed Weapon / Other Weapons", key: "3", isTerminal: true },
            { id: "label_weapons_com_non_lethal", label: "Non-lethal Accessories", key: "4", isTerminal: true },
          ],
        },
        { id: "label_weapons_non_commercial", label: "Non-Commercial Depiction (depiction without promotion or advocacy)", key: "2", isTerminal: true },
      ],
    },

    // B. Violence and Incitement
    {
      id: "label_vi",
      label: "Violence and Incitement",
      key: "B",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_vi_election", label: "Election Violence", key: "1", isTerminal: true },
        {
          id: "label_vi_high",
          label: "High-severity violence",
          key: "2",
          contextQuestion: "Is it threats or admissions?",
          children: [
            { id: "label_vi_high_threats", label: "Threats", key: "1", isTerminal: true },
            { id: "label_vi_high_threats_doi", label: "Threats against DOI/criminals/predators", key: "2", isTerminal: true },
            { id: "label_vi_high_admissions", label: "Admissions", key: "3", isTerminal: true },
            { id: "label_vi_high_calls_death", label: "Calls for death", key: "4", isTerminal: true },
          ],
        },
        {
          id: "label_vi_mid",
          label: "Mid-severity violence",
          key: "3",
          contextQuestion: "Is it threats or admissions?",
          children: [
            { id: "label_vi_mid_threats", label: "Threats", key: "1", isTerminal: true },
            { id: "label_vi_mid_threats_doi", label: "Threats against DOI/criminals/predators", key: "2", isTerminal: true },
            { id: "label_vi_mid_admissions", label: "Admissions", key: "3", isTerminal: true },
          ],
        },
        { id: "label_vi_low", label: "Low-severity violence", key: "4", isTerminal: true },
        { id: "label_vi_weapons_hrl", label: "Bringing weapons to HRL or THRL", key: "5", isTerminal: true },
        {
          id: "label_vi_other",
          label: "Other Violence",
          key: "6",
          contextQuestion: "What type of Other Violence?",
          children: [
            { id: "label_vi_other_services", label: "Services of high-severity violence", key: "1", isTerminal: true },
            { id: "label_vi_other_weapons", label: "Instructions to make or use weapons", key: "2", isTerminal: true },
            { id: "label_vi_other_explosives", label: "Instructions to make or use explosive", key: "3", isTerminal: true },
            { id: "label_vi_other_gender", label: "Glorification of Gender-based violence", key: "4", isTerminal: true },
          ],
        },
      ],
    },

    // C. Hateful Conduct
    {
      id: "label_hc",
      label: "Hateful Conduct",
      key: "C",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_hc_t1_comparisons", label: "T1 - Comparisons to or Generalizations", key: "1", isTerminal: true },
        { id: "label_hc_t1_harm", label: "T1 - Statements supporting harm", key: "2", isTerminal: true },
        { id: "label_hc_t1_stereotype", label: "T1 - Harmful Stereotype", key: "3", isTerminal: true },
        { id: "label_hc_t1_mocking", label: "T1 - Mocking the Concept, Events or Victims of Hate Crimes/ Mocking people on the basis of their PC", key: "4", isTerminal: true },
        {
          id: "label_hc_t2_insults",
          label: "T2 - Insults - Character, Mental, Other",
          key: "5",
          contextQuestion: "What type of Insult in the Content?",
          children: [
            { id: "label_hc_t2_insult_character", label: "Character Insults", key: "1", isTerminal: true },
            { id: "label_hc_t2_insult_mental", label: "Mental Insults", key: "2", isTerminal: true },
            { id: "label_hc_t2_insult_other", label: "Other Insults", key: "3", isTerminal: true },
          ],
        },
        { id: "label_hc_t2_disgust", label: "T2 - Expressions of Disgust", key: "6", isTerminal: true },
        { id: "label_hc_t2_cursing", label: "T2 - Targeted Cursing", key: "7", isTerminal: true },
        { id: "label_hc_t2_exclusion", label: "T2 - Exclusion, Segregation", key: "8", isTerminal: true },
        {
          id: "label_hc_slur",
          label: "Slur",
          key: "9",
          contextQuestion: "How is this slur used?",
          children: [
            { id: "label_hc_slur_no_context", label: "No special context", key: "1", isTerminal: true },
            { id: "label_hc_slur_positive", label: "To mock/condemn/discuss the use of the slur, used self-referentially, or in an explicitly positive context", key: "2", isTerminal: true },
          ],
        },
      ],
    },

    // D. Bullying and Harassment
    {
      id: "label_bh",
      label: "Bullying and Harassment",
      key: "D",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_bh_sexualized", label: "Sexualized Harrassment", key: "1", isTerminal: true },
        { id: "label_bh_calls_death", label: "Calls for death, SSI or to contract or develop a medical condition", key: "2", isTerminal: true },
        { id: "label_bh_claims", label: "Claims about sexual activity, romantic involvement and gender identity", key: "3", isTerminal: true },
        { id: "label_bh_tragedies", label: "Violent Tragedies", key: "4", isTerminal: true },
        { id: "label_bh_comparison", label: "Negative Comparison to animals/inanimate objects", key: "5", isTerminal: true },
        { id: "label_bh_physical", label: "Negative physical description", key: "6", isTerminal: true },
        { id: "label_bh_cursing", label: "Targeted and female gendered Cursing", key: "7", isTerminal: true },
        { id: "label_bh_character", label: "Negative Character/Contempt/Exclusion", key: "8", isTerminal: true },
        { id: "label_bh_physical_bullying", label: "Physical bullying", key: "9", isTerminal: true },
        { id: "label_bh_non_negative", label: "Non-Negative Comparison/claims/description", key: "0", isTerminal: true },
        { id: "label_bh_other", label: "Other", key: "A", isTerminal: true },
      ],
    },

    // E. Coordinating Harm and Promoting Crime
    {
      id: "label_chpc",
      label: "Coordinating Harm and Promoting Crime",
      key: "E",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_chpc_outing", label: "Outing", key: "1", isTerminal: true },
        { id: "label_chpc_animals", label: "Harm Against Animals", key: "2", isTerminal: true },
        { id: "label_chpc_property", label: "Harm Against Property", key: "3", isTerminal: true },
        { id: "label_chpc_voting", label: "Voting Interference", key: "4", isTerminal: true },
        { id: "label_chpc_census", label: "Census Interference", key: "5", isTerminal: true },
        { id: "label_chpc_risky", label: "Risky Behaviour", key: "6", isTerminal: true },
        { id: "label_chpc_people", label: "Other Harm Against People", key: "7", isTerminal: true },
      ],
    },

    // F. Fraud, Scams, and Deceptive Practices
    {
      id: "label_fsdp",
      label: "Fraud, Scams, and Deceptive Practices",
      key: "F",
      contextQuestion: "What Fraud and Deception?",
      children: [
        { id: "label_fsdp_documents", label: "Fake, Forged, Counterfeit or Stolen Documents", key: "1", isTerminal: true },
        { id: "label_fsdp_goods", label: "Fake, Forged or Stolen Goods and Services", key: "2", isTerminal: true },
        { id: "label_fsdp_devices", label: "Devices & Subscriptions Manipulated or Use Unauthorized", key: "3", isTerminal: true },
        { id: "label_fsdp_pii", label: "PII or Other Personal Information", key: "4", isTerminal: true },
        { id: "label_fsdp_cheating", label: "Products & Services Enabling Cheating", key: "5", isTerminal: true },
        { id: "label_fsdp_muling", label: "Money Muling", key: "6", isTerminal: true },
        { id: "label_fsdp_laundering", label: "Money Laundering", key: "7", isTerminal: true },
        { id: "label_fsdp_loan", label: "Loan Fraud and Scam", key: "8", isTerminal: true },
        { id: "label_fsdp_gambling", label: "Gambling Fraud and Scam", key: "9", isTerminal: true },
        { id: "label_fsdp_investment", label: "Investment or Financial Fraud and Scam", key: "0", isTerminal: true },
        { id: "label_fsdp_identity", label: "Inauthentic Identity Fraud and Scam", key: "A", isTerminal: true },
        { id: "label_fsdp_product", label: "Product or Reward Fraud and Scam", key: "B", isTerminal: true },
        { id: "label_fsdp_deceptive", label: "Deceptive and Misleading Practices", key: "C", isTerminal: true },
      ],
    },

    // G. RGS - Tobacco and Alcohol
    {
      id: "label_tobacco_alcohol",
      label: "RGS - Tobacco and Alcohol",
      key: "G",
      contextQuestion: "What abuse type do you see?",
      children: [
        { id: "label_ta_tobacco", label: "Tobacco and Related Products", key: "1", isTerminal: true },
        { id: "label_ta_alcohol", label: "Alcohol", key: "2", isTerminal: true },
      ],
    },

    // H. RGS - Health and Wellness
    {
      id: "label_health_wellness",
      label: "RGS - Health and Wellness",
      key: "H",
      contextQuestion: "What abuse type do you see?",
      children: [
        { id: "label_hw_sexual_business", label: "Adult Sexual Businesses or Sexual Arousal Product", key: "1", isTerminal: true },
        { id: "label_hw_genital", label: "Adult Genital Procedures or Surgeries", key: "2", isTerminal: true },
        { id: "label_hw_reproductive", label: "Reproductive Health & Wellness Products", key: "3", isTerminal: true },
        { id: "label_hw_family", label: "Family Planning Services", key: "4", isTerminal: true },
        { id: "label_hw_sex_ed", label: "Sex Education with sexual focus", key: "5", isTerminal: true },
        { id: "label_hw_weight", label: "Weight Loss Products or Services", key: "6", isTerminal: true },
        { id: "label_hw_cosmetic", label: "Cosmetic Products, Procedures or Surgeries", key: "7", isTerminal: true },
      ],
    },

    // I. RGS - Gambling and Games
    {
      id: "label_gambling",
      label: "RGS - Gambling and Games",
      key: "I",
      contextQuestion: "Which gambling violation type is present?",
      children: [
        { id: "label_gamb_sell", label: "Sell/Trade and/or Promotion of Gambling", key: "1", isTerminal: true },
        { id: "label_gamb_physical", label: "Physical, real-money gambling activity or establishments, e.g., 'brick and mortar casinos'", key: "2", isTerminal: true },
        { id: "label_gamb_lottery", label: "State or government lottery", key: "3", isTerminal: true },
      ],
    },

    // J. RGS Other
    {
      id: "label_rgs_other",
      label: "RGS Other",
      key: "J",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_rgs_endangered", label: "Endangered Species", key: "1", isTerminal: true },
        { id: "label_rgs_animals", label: "Non-Endangered Animals", key: "2", isTerminal: true },
        { id: "label_rgs_body", label: "Body Parts and Fluids", key: "3", isTerminal: true },
        { id: "label_rgs_hazardous", label: "Hazardous Goods and Materials", key: "4", isTerminal: true },
        { id: "label_rgs_artifacts", label: "Historical Artifacts", key: "5", isTerminal: true },
      ],
    },

    // K. RGS - Recalled Products
    {
      id: "label_recalled",
      label: "RGS - Recalled Products",
      key: "K",
      contextQuestion: "In what context?",
      children: [
        { id: "label_recall_bst", label: "Buy/Sell/Trade/Donate/Gift/Ask", key: "1", isTerminal: true },
        { id: "label_recall_promo", label: "Promotion/Education", key: "2", isTerminal: true },
      ],
    },

    // L. Privacy Violation
    {
      id: "label_privacy",
      label: "Privacy Violation",
      key: "L",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_pv_pii", label: "Personally Identifiable Information (PII)", key: "1", isTerminal: true },
        { id: "label_pv_contact", label: "Contact or residential information", key: "2", isTerminal: true },
        { id: "label_pv_financial", label: "Financial information", key: "3", isTerminal: true },
        { id: "label_pv_medical", label: "Medical information", key: "4", isTerminal: true },
        { id: "label_pv_hacked", label: "Information from hacked sources", key: "5", isTerminal: true },
        { id: "label_pv_attributes", label: "Personal attributes", key: "6", isTerminal: true },
      ],
    },

    // M. Cybersecurity
    {
      id: "label_cyber",
      label: "Cybersecurity",
      key: "M",
      contextQuestion: "What exactly?",
      children: [
        { id: "label_cyber_phishing", label: "Phishing", key: "1", isTerminal: true },
        { id: "label_cyber_social", label: "Social Engineering", key: "2", isTerminal: true },
        { id: "label_cyber_login", label: "Publicly Sharing Login Information", key: "3", isTerminal: true },
        { id: "label_cyber_download", label: "Automatic Download", key: "4", isTerminal: true },
        { id: "label_cyber_circumvent", label: "Circumventing Security Systems", key: "5", isTerminal: true },
        { id: "label_cyber_disrupt", label: "Disrupt Communication or Signal Sharing", key: "6", isTerminal: true },
      ],
    },

    // N. Spam
    {
      id: "label_spam",
      label: "Spam",
      key: "N",
      contextQuestion: "What exactly?",
      children: [
        {
          id: "label_spam_engagement",
          label: "Requests for Purchase & Sale of Engagement or Site Privileges",
          key: "1",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_spam_eng_assets", label: "Platform Assets / Privileges", key: "1", isTerminal: true },
            { id: "label_spam_eng_content", label: "Content", key: "2", isTerminal: true },
            { id: "label_spam_eng_engagement", label: "Engagement", key: "3", isTerminal: true },
          ],
        },
        { id: "label_spam_giveaway", label: "Giveaways and Exchanges", key: "2", isTerminal: true },
        { id: "label_spam_gating", label: "Engagement Gating", key: "3", isTerminal: true },
        { id: "label_spam_functionality", label: "Non-Existent Functionality", key: "4", isTerminal: true },
        {
          id: "label_spam_deceptive",
          label: "Deceptive Link",
          key: "5",
          contextQuestion: "What exactly?",
          children: [
            { id: "label_spam_dec_misleading", label: "Misleading Link", key: "1", isTerminal: true },
            { id: "label_spam_dec_gating", label: "Like or share-gating", key: "2", isTerminal: true },
            { id: "label_spam_dec_functionality", label: "Deceptive Platform Functionality", key: "3", isTerminal: true },
            { id: "label_spam_dec_domain", label: "Landing page or domain impersonation", key: "4", isTerminal: true },
          ],
        },
      ],
    },

    // O. Profanity
    { id: "label_profanity", label: "Profanity", key: "O", isTerminal: true },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build full decision path from node IDs
 */
export function buildDecisionPath(nodeIds: string[]): DecisionPath {
  const labels: string[] = [];
  let currentTree: DecisionNode | undefined;
  let action: ActionType = "no_action";

  for (let i = 0; i < nodeIds.length; i++) {
    const nodeId = nodeIds[i];
    
    // First level - main action
    if (i === 0) {
      const mainAction = MAIN_ACTIONS.find(a => a.id === nodeId);
      if (mainAction) {
        labels.push(mainAction.label);
        action = nodeId as ActionType;
        
        if (nodeId === "no_action") currentTree = NO_ACTION_TREE;
        else if (nodeId === "escalate") currentTree = ESCALATE_TREE;
        else if (nodeId === "label") currentTree = LABEL_TREE;
      }
      continue;
    }

    // Subsequent levels - find in tree
    if (currentTree?.children) {
      const node = findNodeById(currentTree, nodeId);
      if (node) {
        labels.push(node.label);
        if (node.children) {
          currentTree = node;
        }
      }
    }
  }

  return {
    action,
    path: labels,
    fullLabel: labels.join(" > "),
    shortcut: nodeIds.join("-"),
  };
}

/**
 * Find node by ID recursively
 */
export function findNodeById(tree: DecisionNode, id: string): DecisionNode | undefined {
  if (tree.id === id) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  
  return undefined;
}

/**
 * Get all terminal nodes (final decisions)
 */
export function getAllTerminalNodes(tree: DecisionNode): DecisionNode[] {
  const terminals: DecisionNode[] = [];
  
  function traverse(node: DecisionNode, path: string[] = []) {
    const currentPath = [...path, node.label];
    
    if (node.isTerminal) {
      terminals.push({ ...node, contextQuestion: currentPath.join(" > ") });
    }
    
    if (node.children) {
      for (const child of node.children) {
        traverse(child, currentPath);
      }
    }
  }
  
  traverse(tree);
  return terminals;
}

/**
 * Export the complete tree for AI consumption
 */
export function getDecisionTreeAsText(): string {
  let text = "# DECISION TREE FOR CONTENT MODERATION\n\n";
  
  // Main actions
  text += "## MAIN ACTIONS\n";
  text += "1. No Action\n";
  text += "2. Escalate\n";
  text += "3. Label\n\n";
  
  // No Action tree
  text += "## NO ACTION OPTIONS\n";
  NO_ACTION_TREE.children?.forEach((child, i) => {
    text += `${i + 1}. ${child.label}\n`;
  });
  text += "\n";
  
  // Escalate tree
  text += "## ESCALATE OPTIONS\n";
  function printEscalateTree(node: DecisionNode, indent: string = "") {
    if (node.children) {
      node.children.forEach((child) => {
        text += `${indent}${child.key || "-"}. ${child.label}\n`;
        if (child.children) {
          printEscalateTree(child, indent + "  ");
        }
      });
    }
  }
  printEscalateTree(ESCALATE_TREE);
  text += "\n";
  
  // Label tree (simplified)
  text += "## LABEL OPTIONS (25 Categories)\n";
  LABEL_TREE.children?.forEach((child) => {
    text += `${child.key}. ${child.label}\n`;
    if (child.children && child.children.length <= 10) {
      child.children.forEach((sub) => {
        text += `  - ${sub.label}\n`;
      });
    }
  });
  
  return text;
}

// ============================================
// COMPLETE DECISION TREE EXPORT
// ============================================

export const DECISION_TREE = {
  mainActions: MAIN_ACTIONS,
  noAction: NO_ACTION_TREE,
  escalate: ESCALATE_TREE,
  label: LABEL_TREE,
};

export default DECISION_TREE;