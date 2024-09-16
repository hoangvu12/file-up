# FileUp

**FileUp** is a simple and elegant file uploader built using [Remix](https://remix.run/), [shadcn](https://shadcn.dev/), and [Fileditch](https://fileditch.com) as the file storage provider.

Note: All the uploaded files data that returned from Fileditch are stored in the browser's local storage.

Please read the [Fileditch FAQ](https://fileditch.com/faq.html).

![preview](https://small.fileditchstuff.me/s16/QjbtvUsZklsIVPXrFyA.png)

## Features

- Elegant and simple user interface
- Fast file uploads using Fileditch

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Bun](https://bun.sh/) - A fast JavaScript runtime (Install it if you haven't already)
- Node.js (Recommended for compatibility)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/hoangvu12/file-up
   cd file-up
   ```

2. Install the dependencies:

   ```sh
   bun install
   ```

### Development

Run the development server:

```sh
bun dev
```

This will start the app in development mode. Open [http://localhost:5173](http://localhost:5173) in your browser to view it.

### Deployment

To deploy the app for production, follow these steps:

1. Build your app for production:

   ```sh
   bun run build
   ```

2. Start the app in production mode:

   ```sh
   bun start
   ```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
