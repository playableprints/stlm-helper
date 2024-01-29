// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {manifest} from '../models';

export function GetAllManifests(arg1:string):Promise<{[key: string]: manifest.iManifestV5}>;

export function MigrateManifests(arg1:string):Promise<Array<string>>;

export function ReadManifest(arg1:string):Promise<manifest.iManifestV5>;

export function WriteManifest(arg1:string,arg2:manifest.iManifestV5):Promise<void>;
