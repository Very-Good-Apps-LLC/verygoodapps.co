# Proposed DMARC record — not applied

| Field         | Value                  |
| ------------- | ---------------------- |
| Zone          | verygoodapps.co        |
| Type          | TXT                    |
| Host/name     | _dmarc                 |
| Full hostname | _dmarc.verygoodapps.co |
| Value         | v=DMARC1; p=none       |
| TTL           | 3600 seconds           |

Authoritative DNS was checked during the audit/proposal and returned NXDOMAIN for `_dmarc.verygoodapps.co`. Recheck immediately before any future change. Add exactly one DMARC TXT record; if a record now exists, review it rather than adding a duplicate.

This policy requests no enforcement. There is no `rua` destination, so aggregate reports are not requested. Add reporting later only after confirming a monitored destination. Leave SPF and DKIM unchanged; no evidence in the audit required modifying them.

After an authorized future DNS change, query the authoritative server and a public resolver. Send a controlled test through the actual outreach account and inspect recipient-side SPF, DKIM, and DMARC results and alignment. This file is preparation only; no DNS change has been made.
