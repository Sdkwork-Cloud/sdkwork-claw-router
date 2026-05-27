# SDKWork File Preview PC React

Reusable preview and download action blocks for secure file access.

Components call `@sdkwork/file-service` to issue short-lived preview/download
URLs on demand. Business pages receive those URLs through callbacks for immediate
use; they should not persist them as business data.
