import { Client, Collection, StageChannel, VoiceChannel } from "discord.js";
import { readFileSync } from 'fs';
import * as path from 'path';

export function setRandomVoiceChannelNames(client: Client): void {
  // Parse & filter groups from file
  const [miscNameGroup, ...nameGroups] = readFileSync(
    path.join(__dirname, '../assets/voice-channel-names.txt')
  )
    .toString()
    .split(/[\n]{2,}/gm)
    .map(nameGroup => nameGroup.split('\n'))
    .filter((nameGroup) => !nameGroup.every(s => s.startsWith('//')));
  
  // Get random group
  const nameGroup = nameGroups[Math.floor(Math.random() * nameGroups.length)];

  // Get voice channels for the current server
  const voiceChannels = client.channels.cache.filter(c => c.isVoice()) as Collection<string, VoiceChannel | StageChannel>;
  const numVoiceChannels = voiceChannels.size;

  // Get list of random names
  const randomNames: string[] = [];
  for (let i = 0; i < numVoiceChannels; i++) {
    let group
    if (nameGroup.length) {
      group = nameGroup;
    } else if (miscNameGroup.length) {
      group = miscNameGroup;
    } else {
      group = ['¯\\_(ツ)_/¯'];
    }

    const randomIndex = Math.floor(Math.random() * group.length);
    const randomName = group.splice(randomIndex, 1)[0];
    randomNames.push(randomName);
  }

  // Set voice channel names
  let j = 0;
  for (const [, voiceChannel] of voiceChannels) {
    const randomName = randomNames[j];
    voiceChannel.setName(randomName).then((e) => console.log(e)).catch((e) => console.log(e));
    j++;
  }
}