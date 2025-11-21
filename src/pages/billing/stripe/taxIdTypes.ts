export interface TaxIdType {
  country: string;
  type: string;
  label: string;
  description: string;
}

// taken from https://docs.stripe.com/billing/customer/tax-ids.md
const taxIdsMd = `
| Country | Enum       | Description                                                                                             | Example               | Impact in Tax Calculation* |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- |
| AD      | ad_nrt     | Andorran NRT number                                                                                     | A-123456-Z            | No                         |
| AE      | ae_trn     | United Arab Emirates TRN                                                                                | 123456789012345       | Yes                        |
| AL      | al_tin     | Albania Tax Identification Number                                                                       | J12345678N            | Yes                        |
| AM      | am_tin     | Armenia Tax Identification Number                                                                       | 02538904              | Yes                        |
| AO      | ao_tin     | Angola Tax Identification Number                                                                        | 5123456789            | No                         |
| AR      | ar_cuit    | Argentinian tax ID number                                                                               | 12-3456789-01         | No                         |
| AT      | eu_vat     | European VAT number                                                                                     | ATU12345678           | Yes                        |
| AU      | au_abn     | Australian Business Number (AU ABN)                                                                     | 12345678912           | Yes                        |
| AU      | au_arn     | Australian Taxation Office Reference Number                                                             | 123456789123          | No                         |
| AW      | aw_tin     | Aruba Tax Identification Number                                                                         | 12345678              | Yes                        |
| AZ      | az_tin     | Azerbaijan Tax Identification Number                                                                    | 0123456789            | Yes                        |
| BA      | ba_tin     | Bosnia and Herzegovina Tax Identification Number                                                        | 123456789012          | Yes                        |
| BB      | bb_tin     | Barbados Tax Identification Number                                                                      | 1123456789012         | No                         |
| BD      | bd_bin     | Bangladesh Business Identification Number                                                               | 123456789-0123        | Yes                        |
| BE      | eu_vat     | European VAT number                                                                                     | BE0123456789          | Yes                        |
| BF      | bf_ifu     | Burkina Faso Tax Identification Number (Numéro d'Identifiant Fiscal Unique)                             | 12345678A             | Yes                        |
| BG      | bg_uic     | Bulgaria Unified Identification Code                                                                    | 123456789             | No                         |
| BG      | eu_vat     | European VAT number                                                                                     | BG0123456789          | Yes                        |
| BH      | bh_vat     | Bahraini VAT Number                                                                                     | 123456789012345       | Yes                        |
| BJ      | bj_ifu     | Benin Tax Identification Number (Identifiant Fiscal Unique)                                             | 1234567890123         | Yes                        |
| BO      | bo_tin     | Bolivian tax ID                                                                                         | 123456789             | No                         |
| BR      | br_cnpj    | Brazilian CNPJ number                                                                                   | 01.234.456/5432-10    | No                         |
| BR      | br_cpf     | Brazilian CPF number                                                                                    | 123.456.789-87        | No                         |
| BS      | bs_tin     | Bahamas Tax Identification Number                                                                       | 123.456.789           | No                         |
| BY      | by_tin     | Belarus TIN Number                                                                                      | 123456789             | Yes                        |
| CA      | ca_bn      | Canadian BN                                                                                             | 123456789             | No                         |
| CA      | ca_gst_hst | Canadian GST/HST number                                                                                 | 123456789RT0002       | Yes                        |
| CA      | ca_pst_bc  | Canadian PST number (British Columbia)                                                                  | PST-1234-5678         | No                         |
| CA      | ca_pst_mb  | Canadian PST number (Manitoba)                                                                          | 123456-7              | No                         |
| CA      | ca_pst_sk  | Canadian PST number (Saskatchewan)                                                                      | 1234567               | No                         |
| CA      | ca_qst     | Canadian QST number (Québec)                                                                            | 1234567890TQ1234      | Yes                        |
| CD      | cd_nif     | Congo (DR) Tax Identification Number (Número de Identificação Fiscal)                                   | A0123456M             | No                         |
| CH      | ch_uid     | Switzerland UID number                                                                                  | CHE-123.456.789 HR    | No                         |
| CH      | ch_vat     | Switzerland VAT number                                                                                  | CHE-123.456.789 MWST  | Yes                        |
| CL      | cl_tin     | Chilean TIN                                                                                             | 12.345.678-K          | Yes                        |
| CM      | cm_niu     | Cameroon Tax Identification Number (Numéro d'Identifiant fiscal Unique)                                 | M123456789000L        | No                         |
| CN      | cn_tin     | Chinese tax ID                                                                                          | 123456789012345678    | No                         |
| CO      | co_nit     | Colombian NIT number                                                                                    | 123.456.789-0         | No                         |
| CR      | cr_tin     | Costa Rican tax ID                                                                                      | 1-234-567890          | No                         |
| CV      | cv_nif     | Cape Verde Tax Identification Number (Número de Identificação Fiscal)                                   | 213456789             | No                         |
| CY      | eu_vat     | European VAT number                                                                                     | CY12345678Z           | Yes                        |
| CZ      | eu_vat     | European VAT number                                                                                     | CZ1234567890          | Yes                        |
| DE      | de_stn     | German Tax Number (Steuernummer)                                                                        | 1234567890            | No                         |
| DE      | eu_vat     | European VAT number                                                                                     | DE123456789           | Yes                        |
| DK      | eu_vat     | European VAT number                                                                                     | DK12345678            | Yes                        |
| DO      | do_rcn     | Dominican RCN number                                                                                    | 123-4567890-1         | No                         |
| EC      | ec_ruc     | Ecuadorian RUC number                                                                                   | 1234567890001         | No                         |
| EE      | eu_vat     | European VAT number                                                                                     | EE123456789           | Yes                        |
| EG      | eg_tin     | Egyptian Tax Identification Number                                                                      | 123456789             | Yes                        |
| ES      | es_cif     | Spanish NIF number (previously Spanish CIF number)                                                      | A12345678             | No                         |
| ES      | eu_vat     | European VAT number                                                                                     | ESA1234567Z           | Yes                        |
| ET      | et_tin     | Ethiopia Tax Identification Number                                                                      | 1234567890            | Yes                        |
| EU      | eu_oss_vat | European One Stop Shop VAT number for non-Union scheme                                                  | EU123456789           | No                         |
| FI      | eu_vat     | European VAT number                                                                                     | FI12345678            | Yes                        |
| FR      | eu_vat     | European VAT number                                                                                     | FRAB123456789         | Yes                        |
| GB      | eu_vat     | Northern Ireland VAT number                                                                             | XI123456789           | Yes                        |
| GB      | gb_vat     | United Kingdom VAT number                                                                               | GB123456789           | Yes                        |
| GE      | ge_vat     | Georgian VAT                                                                                            | 123456789             | Yes                        |
| GN      | gn_nif     | Guinea Tax Identification Number (Número de Identificação Fiscal)                                       | 123456789             | Yes                        |
| GR      | eu_vat     | European VAT number                                                                                     | EL123456789           | Yes                        |
| HK      | hk_br      | Hong Kong BR number                                                                                     | 12345678              | No                         |
| HR      | eu_vat     | European VAT number                                                                                     | HR12345678912         | Yes                        |
| HR      | hr_oib     | Croatian Personal Identification Number                                                                 | 12345678901           | No                         |
| HU      | eu_vat     | European VAT number                                                                                     | HU12345678            | Yes                        |
| HU      | hu_tin     | Hungary tax number (adószám)                                                                            | 12345678-1-23         | No                         |
| ID      | id_npwp    | Indonesian NPWP number                                                                                  | 012.345.678.9-012.345 | No                         |
| IE      | eu_vat     | European VAT number                                                                                     | IE1234567AB           | Yes                        |
| IL      | il_vat     | Israel VAT                                                                                              | 000012345             | No                         |
| IN      | in_gst     | Indian GST number                                                                                       | 12ABCDE3456FGZH       | Yes                        |
| IS      | is_vat     | Icelandic VAT                                                                                           | 123456                | Yes                        |
| IT      | eu_vat     | European VAT number                                                                                     | IT12345678912         | Yes                        |
| JP      | jp_cn      | Japanese Corporate Number (*Hōjin Bangō*)                                                               | 1234567891234         | No                         |
| JP      | jp_rn      | Japanese Registered Foreign Businesses' Registration Number (*Tōroku Kokugai Jigyōsha no Tōroku Bangō*) | 12345                 | No                         |
| JP      | jp_trn     | Japanese Tax Registration Number (*Tōroku Bangō*)                                                       | T1234567891234        | Yes                        |
| KE      | ke_pin     | Kenya Revenue Authority Personal Identification Number                                                  | P000111111A           | No                         |
| KG      | kg_tin     | Kyrgyzstan Tax Identification Number                                                                    | 12345678901234        | No                         |
| KH      | kh_tin     | Cambodia Tax Identification Number                                                                      | 1001-123456789        | Yes                        |
| KR      | kr_brn     | Korean BRN                                                                                              | 123-45-67890          | Yes                        |
| KZ      | kz_bin     | Kazakhstani Business Identification Number                                                              | 123456789012          | Yes                        |
| LA      | la_tin     | Laos Tax Identification Number                                                                          | 123456789-000         | No                         |
| LI      | li_uid     | Liechtensteinian UID number                                                                             | CHE123456789          | No                         |
| LI      | li_vat     | Liechtensteinian VAT number                                                                             | 12345                 | Yes                        |
| LT      | eu_vat     | European VAT number                                                                                     | LT123456789123        | Yes                        |
| LU      | eu_vat     | European VAT number                                                                                     | LU12345678            | Yes                        |
| LV      | eu_vat     | European VAT number                                                                                     | LV12345678912         | Yes                        |
| MA      | ma_vat     | Morocco VAT Number                                                                                      | 12345678              | Yes                        |
| MD      | md_vat     | Moldova VAT Number                                                                                      | 1234567               | Yes                        |
| ME      | me_pib     | Montenegro PIB Number                                                                                   | 12345678              | No                         |
| MK      | mk_vat     | North Macedonia VAT Number                                                                              | MK1234567890123       | Yes                        |
| MR      | mr_nif     | Mauritania Tax Identification Number (Número de Identificação Fiscal)                                   | 12345678              | No                         |
| MT      | eu_vat     | European VAT number                                                                                     | MT12345678            | Yes                        |
| MX      | mx_rfc     | Mexican RFC number                                                                                      | ABC010203AB9          | No                         |
| MY      | my_frp     | Malaysian FRP number                                                                                    | 12345678              | No                         |
| MY      | my_itn     | Malaysian ITN                                                                                           | C 1234567890          | No                         |
| MY      | my_sst     | Malaysian SST number                                                                                    | A12-3456-78912345     | No                         |
| NG      | ng_tin     | Nigerian Tax Identification Number                                                                      | 12345678-0001         | No                         |
| NL      | eu_vat     | European VAT number                                                                                     | NL123456789B12        | Yes                        |
| NO      | no_vat     | Norwegian VAT number                                                                                    | 123456789MVA          | Yes                        |
| NO      | no_voec    | Norwegian VAT on e-commerce number                                                                      | 1234567               | No                         |
| NP      | np_pan     | Nepal PAN Number                                                                                        | 123456789             | Yes                        |
| NZ      | nz_gst     | New Zealand GST number                                                                                  | 123456789             | Yes                        |
| OM      | om_vat     | Omani VAT Number                                                                                        | OM1234567890          | Yes                        |
| PE      | pe_ruc     | Peruvian RUC number                                                                                     | 12345678901           | Yes                        |
| PH      | ph_tin     | Philippines Tax Identification Number                                                                   | 123456789012          | Yes                        |
| PL      | eu_vat     | European VAT number                                                                                     | PL1234567890          | Yes                        |
| PT      | eu_vat     | European VAT number                                                                                     | PT123456789           | Yes                        |
| RO      | eu_vat     | European VAT number                                                                                     | RO1234567891          | Yes                        |
| RO      | ro_tin     | Romanian tax ID number                                                                                  | 1234567890123         | No                         |
| RS      | rs_pib     | Serbian PIB number                                                                                      | 123456789             | No                         |
| RU      | ru_inn     | Russian INN                                                                                             | 1234567891            | Yes                        |
| RU      | ru_kpp     | Russian KPP                                                                                             | 123456789             | Yes                        |
| SA      | sa_vat     | Saudi Arabia VAT                                                                                        | 123456789012345       | Yes                        |
| SE      | eu_vat     | European VAT number                                                                                     | SE123456789123        | Yes                        |
| SG      | sg_gst     | Singaporean GST                                                                                         | M12345678X            | Yes                        |
| SG      | sg_uen     | Singaporean UEN                                                                                         | 123456789F            | No                         |
| SI      | eu_vat     | European VAT number                                                                                     | SI12345678            | Yes                        |
| SI      | si_tin     | Slovenia tax number (davčna številka)                                                                   | 12345678              | No                         |
| SK      | eu_vat     | European VAT number                                                                                     | SK1234567891          | Yes                        |
| SN      | sn_ninea   | Senegal NINEA Number                                                                                    | 12345672A2            | No                         |
| SR      | sr_fin     | Suriname FIN Number                                                                                     | 1234567890            | Yes                        |
| SV      | sv_nit     | El Salvadorian NIT number                                                                               | 1234-567890-123-4     | No                         |
| TH      | th_vat     | Thai VAT                                                                                                | 1234567891234         | Yes                        |
| TJ      | tj_tin     | Tajikistan Tax Identification Number                                                                    | 123456789             | Yes                        |
| TR      | tr_tin     | Turkish Tax Identification Number                                                                       | 0123456789            | Yes                        |
| TW      | tw_vat     | Taiwanese VAT                                                                                           | 12345678              | Yes                        |
| TZ      | tz_vat     | Tanzania VAT Number                                                                                     | 12345678A             | Yes                        |
| UA      | ua_vat     | Ukrainian VAT                                                                                           | 123456789             | Yes                        |
| UG      | ug_tin     | Uganda Tax Identification Number                                                                        | 1014751879            | Yes                        |
| US      | us_ein     | United States EIN                                                                                       | 12-3456789            | No                         |
| UY      | uy_ruc     | Uruguayan RUC number                                                                                    | 123456789012          | Yes                        |
| UZ      | uz_tin     | Uzbekistan TIN Number                                                                                   | 123456789             | No                         |
| UZ      | uz_vat     | Uzbekistan VAT Number                                                                                   | 123456789012          | Yes                        |
| VE      | ve_rif     | Venezuelan RIF number                                                                                   | A-12345678-9          | No                         |
| VN      | vn_tin     | Vietnamese tax ID number                                                                                | 1234567890            | No                         |
| ZA      | za_vat     | South African VAT number                                                                                | 4123456789            | Yes                        |
| ZM      | zm_tin     | Zambia Tax Identification Number                                                                        | 1004751879            | No                         |
| ZW      | zw_tin     | Zimbabwe Tax Identification Number                                                                      | 1234567890            | No                         |
`

function parseMdLine(line: string): TaxIdType | null {
  // Skip empty lines, header, and separator lines
  if (!line.trim() || line.includes('Country') || line.includes('---')) {
    return null;
  }

  // Split by pipe and trim whitespace
  const parts = line.split('|').map(part => part.trim()).filter(part => part);

  // Should have 5 parts: Country, Enum, Description, Example, Impact
  if (parts.length < 3) {
    return null;
  }

  const [country, enumValue, description] = parts;

  // Create a friendly label from the enum value
  // e.g., "eu_vat" -> "EU VAT", "us_ein" -> "US EIN"
  const label = enumValue
    .split('_')
    .map(part => part.toUpperCase())
    .join(' ');

  return {
    country: country,
    type: enumValue,
    label: label,
    description: description,
  };
}

function parseTaxIdsMd(md: string): TaxIdType[] {
  const lines = md.split('\n');
  const taxIdTypes: TaxIdType[] = [];

  for (const line of lines) {
    const parsed = parseMdLine(line);
    if (parsed) {
      taxIdTypes.push(parsed);
    }
  }

  return taxIdTypes;
}

export const TAX_ID_TYPES: TaxIdType[] = parseTaxIdsMd(taxIdsMd);

export const getTaxIdTypesByCountry = (country: string) => {
  return TAX_ID_TYPES.filter(t => t.country === country)
}

export const getTaxIdByCountryAndEnum = (country: string | undefined, type: string) => {
  if (country) {
    return getTaxIdTypesByCountry(country).find(t => t.type === type) || TAX_ID_TYPES.find(t => t.type === type)
  }
  return TAX_ID_TYPES.find(t => t.type === type)
}
