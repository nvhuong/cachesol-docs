# Applications (Miniapps)

Mỗi thư mục con là một **miniapp** nghiệp vụ.

## Danh sách
| Miniapp | Domain | Requirement index |
|---------|--------|-------------------|
| [hrm](hrm/) | hrm | [requirement/_index.md](hrm/requirement/_index.md) |
| [attendance](attendance/) | hrm / attendance | [requirement/_index.md](attendance/requirement/_index.md) |
| [erp](erp/) | erp | [requirement/_index.md](erp/requirement/_index.md) |
| [finance](finance/) | finance | [requirement/_index.md](finance/requirement/_index.md) |
| [sales](sales/) | crm | [requirement/_index.md](sales/requirement/_index.md) |
| [marketing](marketing/) | crm / marketing | [requirement/_index.md](marketing/requirement/_index.md) |

## Cấu trúc chuẩn mỗi miniapp
```text
<miniapp>/
├── requirement/<feature-id>/requirement.txt + images/
├── docs/<feature-id>/
├── frontend/
├── backend/
└── tests/<feature-id>/
```

Template: [`_templates/requirement/FEATURE-ID/`](_templates/requirement/FEATURE-ID/)  
Luồng: [`../FEATURE-LIFECYCLE.md`](../FEATURE-LIFECYCLE.md)
