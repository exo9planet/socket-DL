// TODO: This is duplicate from socket-dl and should be in its own module
import { ChainSlug, ChainSocketAddresses, DeploymentMode, IntegrationTypes } from "./types";

import dev_addresses from "../deployments/dev_addresses.json";
import prod_addresses from "../deployments/prod_addresses.json";
import surge_addresses from "../deployments/surge_addresses.json";

function getAddresses(
  srcChainSlug: ChainSlug,
  mode: DeploymentMode
): ChainSocketAddresses {
  let addresses: ChainSocketAddresses;
  switch (mode) {
    case DeploymentMode.DEV:
      addresses = dev_addresses[srcChainSlug];
      break;
    case DeploymentMode.DEV:
      addresses = prod_addresses[srcChainSlug];
      break;
    case DeploymentMode.DEV:
      addresses = surge_addresses[srcChainSlug];
      break;
    default:
      throw new Error("No Mode Provided");
  }

  return addresses;
}

function getSwitchboardAddress(
  srcChainSlug: ChainSlug,
  dstChainSlug: ChainSlug,
  integration: IntegrationTypes,
  mode: DeploymentMode
) {
  const addr = getAddresses(srcChainSlug, mode);
  const switchboardAddress =
    addr?.["integrations"]?.[dstChainSlug]?.[integration]?.switchboard;

  if (!switchboardAddress) {
    throw new Error(
      `Switchboard address for ${srcChainSlug}-${dstChainSlug}-${integration} not found`
    );
  }

  return switchboardAddress;
}

function getCapacitorAddress(
  srcChainSlug: ChainSlug,
  dstChainSlug: ChainSlug,
  integration: IntegrationTypes,
  mode: DeploymentMode
) {
  const addr = getAddresses(srcChainSlug, mode);
  const capacitorAddress =
    addr?.["integrations"]?.[dstChainSlug]?.[integration]?.capacitor;

  if (!capacitorAddress) {
    throw new Error(
      `Capacitor address for ${srcChainSlug}-${dstChainSlug}-${integration} not found`
    );
  }

  return capacitorAddress;
}

function getDeCapacitorAddress(
  srcChainSlug: ChainSlug,
  dstChainSlug: ChainSlug,
  integration: IntegrationTypes,
  mode: DeploymentMode
) {
  const addr = getAddresses(srcChainSlug, mode);
  const deCapacitorAddress =
    addr?.["integrations"]?.[dstChainSlug]?.[integration]?.capacitor;

  if (!deCapacitorAddress) {
    throw new Error(
      `De Capacitor address for ${srcChainSlug}-${dstChainSlug}-${integration} not found`
    );
  }

  return deCapacitorAddress;
}

export { getSwitchboardAddress, getCapacitorAddress, getDeCapacitorAddress, getAddresses };
