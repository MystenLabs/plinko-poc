// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { ReactElement } from "react";

export interface NavigationLink {
  title: string;
  href: string;
  icon?: ReactElement;
}
