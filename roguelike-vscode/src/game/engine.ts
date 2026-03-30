import { GameTerminal, ansi } from '../terminal';

// Key codes sent by the terminal for special keys
const KEY = {
  escape: '\x1b',
  ctrlC: '\x03',
  enter: '\r',
};

export class GameEngine {
  private terminal: GameTerminal;

  constructor(terminal: GameTerminal) {
    this.terminal = terminal;
  }

start(): void {
  this.terminal.onInput((data) => this.handleInput(data));
  // Small delay lets the PTY fully open before we write to it
  setTimeout(() => this.render(), 100);
}

  private handleInput(data: string): void {
    // ESC or Ctrl+C quits
    if (data === KEY.escape || data === KEY.ctrlC) {
      this.terminal.clearScreen();
      this.terminal.write(ansi.yellow + '  Farewell, adventurer.\n\r' + ansi.reset);
      setTimeout(() => this.terminal.exit(), 800);
    }
  }

  private render(): void {
    this.terminal.clearScreen();

    const lines = [
      '',
      ansi.yellow + ansi.bold + '  ██████╗  ██████╗  ██████╗ ██╗   ██╗███████╗██╗     ██╗██╗  ██╗███████╗' + ansi.reset,
      ansi.yellow +             '  ██╔══██╗██╔═══██╗██╔════╝ ██║   ██║██╔════╝██║     ██║██║ ██╔╝██╔════╝' + ansi.reset,
      ansi.yellow +             '  ██████╔╝██║   ██║██║  ███╗██║   ██║█████╗  ██║     ██║█████╔╝ █████╗  ' + ansi.reset,
      ansi.yellow +             '  ██╔══██╗██║   ██║██║   ██║██║   ██║██╔══╝  ██║     ██║██╔═██╗ ██╔══╝  ' + ansi.reset,
      ansi.yellow +             '  ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗██║██║  ██╗███████╗' + ansi.reset,
      ansi.gray +               '  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝╚═╝  ╚═╝╚══════╝' + ansi.reset,
      '',
      ansi.cyan + '                        A dungeon awaits beneath your feet.' + ansi.reset,
      '',
      ansi.gray + '                              Milestone 1 — Hello, dungeon!' + ansi.reset,
      '',
      '',
      ansi.white + '                                  Press  ' + ansi.yellow + ansi.bold + 'ESC' + ansi.reset + ansi.white + '  to quit' + ansi.reset,
      '',
    ];

    this.terminal.write(lines.join('\n\r'));
  }
}
