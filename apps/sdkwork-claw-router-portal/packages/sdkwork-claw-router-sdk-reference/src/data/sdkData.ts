import {
  CLAWROUTER_APP_SDK_REFERENCE_METADATA,
  CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA,
  CLAWROUTER_CLOUD_SERVICES_SDK_REFERENCE_METADATA,
  SDK_SYSTEM_CONFIG,
} from 'sdkwork-claw-router-commons/runtime';
import type { ClawRouterGeneratedSdkMetadata } from 'sdkwork-claw-router-commons/runtime';
import type { GeneratedSdkType, SdkReferenceSystem } from '../sdkReferenceRuntime';

export interface SdkLanguage {
  id: string;
  name: string;
  icon: string;
  description: string;
  installCommand: string;
  importCode: string;
  initCode: string;
  exampleCode: string;
  githubUrl: string;
}

export type ApiSystem = SdkReferenceSystem;

export type GeneratedSdkMetadata = ClawRouterGeneratedSdkMetadata;

export {
  CLAWROUTER_APP_SDK_REFERENCE_METADATA,
  CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA,
  CLAWROUTER_CLOUD_SERVICES_SDK_REFERENCE_METADATA,
};

export const getGeneratedSdkMetadataForSystem = (system: ApiSystem): GeneratedSdkMetadata => (
  SDK_SYSTEM_CONFIG[system]
);

const NODE_ENV_REFERENCE = 'process' + '.env';

function fallbackGatewayBaseUrl(apiPrefix: string): string {
  return apiPrefix === '/v1' ? 'https://api.sdkwork.com' : apiPrefix;
}

export const getSdkDataForSystem = (system: ApiSystem): SdkLanguage[] => {
  const systemNames = {
    gateway: 'Claw Router Open API',
    'cloud-services': 'Cloud Services API',
    app: 'App API',
    backend: 'Backend API'
  };

  const packageNames = {
    gateway: {
      ts: SDK_SYSTEM_CONFIG.gateway.packageName,
      py: 'sdkwork-ai-sdk',
      go: 'github.com/sdkwork/ai-sdk-go',
      java: 'sdkwork-ai-sdk-java',
      ruby: 'sdkwork-ai-sdk',
      php: 'sdkwork/ai-sdk-php',
      csharp: 'Sdkwork.AiSdk',
      rust: 'sdkwork-ai-sdk',
      flutter: 'sdkwork_ai_sdk'
    },
    'cloud-services': {
      ts: SDK_SYSTEM_CONFIG['cloud-services'].packageName,
      py: 'sdkwork-clawrouter-cloud-services-sdk',
      go: 'github.com/sdkwork/clawrouter-cloud-services-sdk-go',
      java: 'clawrouter-cloud-services-sdk-java',
      ruby: 'sdkwork-clawrouter-cloud-services-sdk',
      php: 'sdkwork/clawrouter-cloud-services-sdk-php',
      csharp: 'Sdkwork.ClawrouterCloudServicesSdk',
      rust: 'sdkwork-clawrouter-cloud-services-sdk',
      flutter: 'clawrouter_cloud_services_sdk'
    },
    app: {
      ts: SDK_SYSTEM_CONFIG.app.packageName,
      py: 'sdkwork-clawrouter-app-sdk',
      go: 'github.com/sdkwork/clawrouter-app-sdk-go',
      java: 'clawrouter-app-sdk-java',
      ruby: 'sdkwork-clawrouter-app-sdk',
      php: 'sdkwork/clawrouter-app-sdk-php',
      csharp: 'Sdkwork.ClawrouterAppSdk',
      rust: 'sdkwork-clawrouter-app-sdk',
      flutter: 'clawrouter_app_sdk'
    },
    backend: {
      ts: SDK_SYSTEM_CONFIG.backend.packageName,
      py: 'sdkwork-clawrouter-backend-sdk',
      go: 'github.com/sdkwork/clawrouter-backend-sdk-go',
      java: 'clawrouter-backend-sdk-java',
      ruby: 'sdkwork-clawrouter-backend-sdk',
      php: 'sdkwork/clawrouter-backend-sdk-php',
      csharp: 'Sdkwork.ClawrouterBackendSdk',
      rust: 'sdkwork-clawrouter-backend-sdk',
      flutter: 'clawrouter_backend_sdk'
    },
  };

  const classNames = {
    gateway: SDK_SYSTEM_CONFIG.gateway.name,
    'cloud-services': SDK_SYSTEM_CONFIG['cloud-services'].name,
    app: SDK_SYSTEM_CONFIG.app.name,
    backend: SDK_SYSTEM_CONFIG.backend.name
  };

  const examples = {
    gateway: {
      ts: `async function main() {\n  const response = await client.chat.completions.create({\n    model: "gpt-4o",\n    messages: [{ role: "user", content: "Hello world!" }],\n  });\n  console.log(response.choices[0].message.content);\n}\n\nmain();`,
      py: `def main():\n    response = client.chat.completions.create(\n        model="gpt-4o",\n        messages=[{"role": "user", "content": "Hello world!"}]\n    )\n    print(response.choices[0].message.content)\n\nif __name__ == "__main__":\n    main()`,
      go: `func main() {\n    resp, err := client.Chat.Completions.Create(context.Background(), claw.ChatCompletionRequest{\n        Model: "gpt-4o",\n        Messages: []claw.ChatCompletionMessage{\n            {Role: "user", Content: "Hello world!"},\n        },\n    })\n    if err != nil {\n        log.Fatal(err)\n    }\n    fmt.Println(resp.Choices[0].Message.Content)\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        ChatCompletionRequest request = ChatCompletionRequest.builder()\n            .model("gpt-4o")\n            .addMessage(ChatMessage.user("Hello world!"))\n            .build();\n\n        ChatCompletionResponse response = client.chat().completions().create(request);\n        System.out.println(response.getChoices().get(0).getMessage().getContent());\n    }\n}`,
      ruby: `response = client.chat.completions.create(\n  model: "gpt-4o",\n  messages: [{ role: "user", content: "Hello world!" }]\n)\nputs response.choices[0].message.content`,
      php: `$response = $client->chat()->completions()->create([\n    'model' => 'gpt-4o',\n    'messages' => [['role' => 'user', 'content' => 'Hello world!']]\n]);\necho $response->choices[0]->message->content;`,
      csharp: `var response = await client.Chat.Completions.CreateAsync(new ChatCompletionRequest\n{\n    Model = "gpt-4o",\n    Messages = new[] { new Message { Role = "user", Content = "Hello world!" } }\n});\nConsole.WriteLine(response.Choices[0].Message.Content);`,
      rust: `let response = client.chat().completions().create(ChatCompletionRequest {\n    model: "gpt-4o".to_string(),\n    messages: vec![Message { role: "user".to_string(), content: "Hello world!".to_string() }]\n}).await?;\nprintln!("{}", response.choices[0].message.content);`,
      flutter: `void main() async {\n  final response = await client.chat.completions.create(\n    model: "gpt-4o",\n    messages: [ChatMessage(role: "user", content: "Hello world!")],\n  );\n  print(response.choices[0].message.content);\n}`
    },
    backend: {
      ts: `async function main() {\n  const apiKeys = await client.iam.apiKeys.list();\n  console.log(apiKeys);\n}\n\nmain();`,
      py: `def main():\n    api_keys = client.iam.apiKeys.fetch_api_keys_map()\n    print(api_keys)\n\nif __name__ == "__main__":\n    main()`,
      go: `func main() {\n    keys, err := client.Apikey.FetchApiKeysMap(context.Background())\n    if err != nil {\n        log.Fatal(err)\n    }\n    fmt.Println(keys)\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        ApiKeyMapResponse response = client.apikey().fetchApiKeysMap();\n        System.out.println(response.getData());\n    }\n}`,
      ruby: `api_keys = client.iam.apiKeys.fetch_api_keys_map\nputs api_keys`,
      php: `$apiKeys = $client->apikey()->fetchApiKeysMap();\nprint_r($apiKeys);`,
      csharp: `var apiKeys = await client.Apikey.FetchApiKeysMapAsync();\nConsole.WriteLine(apiKeys);`,
      rust: `let api_keys = client.apikey().fetch_api_keys_map().await?;\nprintln!("{:?}", api_keys);`,
      flutter: `void main() async {\n  final apiKeys = await client.iam.apiKeys.fetchApiKeysMap();\n  print(apiKeys);\n}`
    },
    'cloud-services': {
      ts: `async function main() {\n  const config = await client.storage.sdkConfig.retrieve({\n    providerCode: "aws_s3",\n    bucket: "uploads",\n  });\n  console.log(config.data.endpoint);\n}\n\nmain();`,
      py: `def main():\n    config = client.storage.sdk_config.retrieve(provider_code="aws_s3", bucket="uploads")\n    print(config.data.endpoint)\n\nif __name__ == "__main__":\n    main()`,
      go: `func main() {\n    config, err := client.Storage.SdkConfig.Retrieve(context.Background(), claw.StorageSdkConfigRetrieveParams{\n        ProviderCode: \"aws_s3\",\n        Bucket: \"uploads\",\n    })\n    if err != nil {\n        log.Fatal(err)\n    }\n    fmt.Println(config.Data.Endpoint)\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        S3ClientSdkConfigResult config = client.storage().sdkConfig().retrieve(\n            StorageSdkConfigRetrieveParams.builder()\n                .providerCode(\"aws_s3\")\n                .bucket(\"uploads\")\n                .build()\n        );\n        System.out.println(config.getData().getEndpoint());\n    }\n}`,
      ruby: `config = client.storage.sdk_config.retrieve(provider_code: "aws_s3", bucket: "uploads")\nputs config.data.endpoint`,
      php: `$config = $client->storage()->sdkConfig()->retrieve([\n    'providerCode' => 'aws_s3',\n    'bucket' => 'uploads'\n]);\necho $config->data->endpoint;`,
      csharp: `var config = await client.Storage.SdkConfig.RetrieveAsync(new StorageSdkConfigRetrieveParams\n{\n    ProviderCode = "aws_s3",\n    Bucket = "uploads"\n});\nConsole.WriteLine(config.Data.Endpoint);`,
      rust: `let config = client.storage().sdk_config().retrieve(StorageSdkConfigRetrieveParams {\n    provider_code: Some("aws_s3".to_string()),\n    bucket: Some("uploads".to_string()),\n}).await?;\nprintln!("{}", config.data.endpoint);`,
      flutter: `void main() async {\n  final config = await client.storage.sdkConfig.retrieve(\n    providerCode: 'aws_s3',\n    bucket: 'uploads',\n  );\n  print(config.data.endpoint);\n}`
    },
    app: {
      ts: `async function main() {\n  const profile = await client.iam.users.current.retrieve();\n  console.log(profile);\n}\n\nmain();`,
      py: `def main():\n    profile = client.iam.users.current.retrieve()\n    print(profile)\n\nif __name__ == "__main__":\n    main()`,
      go: `func main() {\n    profile, err := client.Iam.Users.Current.Retrieve(context.Background())\n    if err != nil {\n        log.Fatal(err)\n    }\n    fmt.Println(profile)\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        UsersCurrentRetrieveResult response = client.iam().users().current().retrieve();\n        System.out.println(response.getData());\n    }\n}`,
      ruby: `profile = client.iam.users.current.retrieve\nputs profile`,
      php: `$profile = $client->iam()->users()->current()->retrieve();\nprint_r($profile);`,
      csharp: `var profile = await client.Iam.Users.Current.RetrieveAsync();\nConsole.WriteLine(profile);`,
      rust: `let profile = client.iam().users().current().retrieve().await?;\nprintln!("{:?}", profile);`,
      flutter: `void main() async {\n  final profile = await client.iam.users.current.retrieve();\n  print(profile);\n}`
    }
  };

  const pkgs = packageNames[system];
  const cls = classNames[system];
  const ex = examples[system];
  const sysName = systemNames[system];
  const generatedSdk = SDK_SYSTEM_CONFIG[system];
  const defaultBaseUrl = system === 'gateway'
    ? fallbackGatewayBaseUrl(generatedSdk.apiPrefix)
    : generatedSdk.apiPrefix;
  const baseUrl = 'https://github.com/sdkwork/claw-router/tree/main';

  return [
    {
      id: 'typescript',
      name: 'TypeScript / Node.js',
      icon: 'Terminal',
      description: `Official TypeScript SDK for ${sysName} in Node.js and browser environments.`,
      installCommand: `npm install ${pkgs.ts}`,
      importCode: `import { ${cls} } from "${pkgs.ts}";`,
      initCode: `const client = new ${cls}({\n  baseUrl: ${NODE_ENV_REFERENCE}.CLAWROUTER_API_BASE_URL ?? "${defaultBaseUrl}",\n  apiKey: ${NODE_ENV_REFERENCE}.CLAW_API_KEY,\n});`,
      exampleCode: ex.ts,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'python',
      name: 'Python',
      icon: 'Code',
      description: `Official Python SDK for ${sysName}.`,
      installCommand: `pip install ${pkgs.py}`,
      importCode: `from ${pkgs.py.replace(/-/g, '_')} import ${cls}`,
      initCode: `client = ${cls}(\n    api_key="YOUR_API_KEY"\n)`,
      exampleCode: ex.py,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'go',
      name: 'Go',
      icon: 'TerminalSquare',
      description: `Official Go SDK for ${sysName}.`,
      installCommand: `go get ${pkgs.go}`,
      importCode: `import "${pkgs.go}"`,
      initCode: `client := claw.New${cls}(os.Getenv("CLAW_API_KEY"))`,
      exampleCode: ex.go,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'java',
      name: 'Java',
      icon: 'Coffee',
      description: `Official Java SDK for ${sysName}.`,
      installCommand: `<dependency>\n  <groupId>com.sdkwork</groupId>\n  <artifactId>${pkgs.java}</artifactId>\n  <version>1.0.0</version>\n</dependency>`,
      importCode: `import com.sdkwork.${pkgs.java.replace(/-/g, '')}.${cls};`,
      initCode: `${cls} client = ${cls}.builder()\n    .apiKey(System.getenv("CLAW_API_KEY"))\n    .build();`,
      exampleCode: ex.java,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'ruby',
      name: 'Ruby',
      icon: 'Gem',
      description: `Official Ruby SDK for ${sysName}.`,
      installCommand: `gem install ${pkgs.ruby}`,
      importCode: `require '${pkgs.ruby.replace(/-/g, '_')}'`,
      initCode: `client = Sdkwork::${cls}.new(api_key: ENV['CLAW_API_KEY'])`,
      exampleCode: ex.ruby,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'php',
      name: 'PHP',
      icon: 'FileCode2',
      description: `Official PHP SDK for ${sysName}.`,
      installCommand: `composer require ${pkgs.php}`,
      importCode: `require_once('vendor/autoload.php');\nuse Sdkwork\\${cls};`,
      initCode: `$client = new ${cls}($_ENV['CLAW_API_KEY']);`,
      exampleCode: ex.php,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'csharp',
      name: 'C# (.NET)',
      icon: 'Hash',
      description: `Official C# .NET SDK for ${sysName}.`,
      installCommand: `dotnet add package ${pkgs.csharp}`,
      importCode: `using ${pkgs.csharp};`,
      initCode: `var client = new ${cls}(Environment.GetEnvironmentVariable("CLAW_API_KEY"));`,
      exampleCode: ex.csharp,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'rust',
      name: 'Rust',
      icon: 'Cog',
      description: `Official Rust SDK for ${sysName}.`,
      installCommand: `cargo add ${pkgs.rust}`,
      importCode: `use ${pkgs.rust.replace(/-/g, '_')}::${cls};`,
      initCode: `let client = ${cls}::new(env::var("CLAW_API_KEY").unwrap());`,
      exampleCode: ex.rust,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    },
    {
      id: 'flutter',
      name: 'Flutter / Dart',
      icon: 'Smartphone',
      description: `Official Flutter/Dart SDK for ${sysName}.`,
      installCommand: `flutter pub add ${pkgs.flutter}`,
      importCode: `import 'package:${pkgs.flutter}/${pkgs.flutter}.dart';`,
      initCode: `final client = ${cls}(apiKey: Platform.environment['CLAW_API_KEY']!);`,
      exampleCode: ex.flutter,
      githubUrl: `${baseUrl}/${generatedSdk.sourceDir}`
    }
  ];
};

// Default export for backward compatibility if needed
export const SDK_DATA = getSdkDataForSystem('gateway');
