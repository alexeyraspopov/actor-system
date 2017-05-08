import { ActorSystem } from 'actor-system';
import Storage from './Storage';

export function ActorSystemType(props, propName, componentName, location, propFullName) {
  if (props[propName] instanceof ActorSystem) return null;
  throw new Error(`Invalid ${location} "${propFullName}" of type ${typeof props[propName]}. Expected to receive ActorSystem`);
}

export function StorageType(props, propName, componentName, location, propFullName) {
  if (props[propName] instanceof Storage) return null;
  throw new Error(`Invalid ${location} "${propFullName}" of type ${typeof props[propName]}. Expected to receive Storage`);
}
