---
title: x86 Paging Tutorial
permalink: x86-paging/
description: With simple examples and applications.
social_media: true
---

Extracted from [my Stack Overflow answer](http://stackoverflow.com/a/18431262/895245).

{{ site.toc }}

## General facts

Paging translates linear addresses, what is left after segmentation translated logical addresses, into physical addresses, what actually goes go to RAM wires:

    (logical) ------------------> (linear) ------------> (physical)
                 segmentation                 paging

Paging is only available on protected mode. The use of paging protected mode is optional. Paging is on iff the `PG` bit of the `cr0` register is set.

## Paging vs segmentation

One major difference between paging and segmentation is that:

- paging splits RAM into equal sized chunks called pages
- segmentation splits memory into chunks of arbitrary sizes

This is the main advantage of paging, since equal sized chunks make things more manageable.

Paging has become so much more popular that support for segmentation was dropped in x86-64 in 64-bit mode, the main mode of operation for new software, where it only exists in compatibility mode, which emulates IA32.

## Application

Paging is used to implement processes virtual address spaces on modern OS. With virtual addresses the OS can fit two or more concurrent processes on a single RAM in a way that:

- both programs need to know nothing about the other
- the memory of both programs can grow and shrink as needed
- the switch between programs is very fast
- one program can never access the memory of another process

Paging historically came after segmentation, and largely replaced it for the implementation of virtual memory in modern OSs such as Linux since it is easier to manage the fixed sized chunks of memory of pages instead of variable length segments.

## Hardware implementation

Just like for segmentation, paging hardware uses RAM data structures (page tables, page directories, etc.) to do its job.

The format of those data structures is fixed *by the hardware*, but it is up to the OS to set up and manage those data structures on RAM correctly, and to tell the hardware where to find them (via `cr3`).

Paging could be implemented in software but is hardware implemented because paging operations are done at every single memory access and therefore need to be very fast.

## Example: simplified single-level paging scheme

This is an example of how paging operates on a *simplified* version of a x86 architecture
to implement a virtual memory space.

### Page tables

The OS could give them the following page tables:

Page table given to process 1 by the OS:

    RAM location        physical address   present
    -----------------   -----------------  --------
    PT1 + 0       * L   0x00001            1
    PT1 + 1       * L   0x00000            1
    PT1 + 2       * L   0x00003            1
    PT1 + 3       * L                      0
    ...                                    ...
    PT1 + 0xFFFFF * L   0x00005            1

Page table given to process 2 by the OS:

    RAM location       physical address   present
    -----------------  -----------------  --------
    PT2 + 0       * L  0x0000A            1
    PT2 + 1       * L  0x0000B            1
    PT2 + 2       * L                     0
    PT2 + 3       * L  0x00003            1
    ...                ...                ...
    PT2 + 0xFFFFF * L  0x00004            1

Where:

-   `PT1` and `PT2`: initial position of table 1 and 2 on RAM.

    Sample values: `0x00000000`, `0x12345678`, etc.

    It is the OS that decides those values.

-   `L`: length of a page table entry.

-   `present`: indicates that the page is present in memory.

Page tables are located on RAM. They could for example be located as:

    --------------> 0xFFFFFFFF


    --------------> PT1 + 0xFFFFF * L
    Page Table 1
    --------------> PT1


    --------------> PT2 + 0xFFFFF * L
    Page Table 2
    --------------> PT2

    --------------> 0x0

The initial locations on RAM for both page tables are arbitrary and controlled by the OS. It is up to the OS to ensure that they don't overlap!

Each process cannot touch any page tables directly, although it can make requests to the OS that cause the page tables to be modified, for example asking for larger stack or heap segments.

A page is a chunk of 4KB (12 bits), and since addresses have 32 bits, only 20 bits (20 + 12 = 32, thus 5 characters in hexadecimal notation) are required to identify each page. This value is fixed by the hardware.

### Page table entries

A page table is... a table of pages table entries!

The exact format of table entries is fixed *by the hardware*.

On this simplified example, the page table entries contain only two fields:

    bits   function
    -----  -----------------------------------------
    20     physical address of the start of the page
    1      present flag

so in this example the hardware designers could have chosen `L = 21`.

Most real page table entries have other fields.

It would be impractical to align things at 21 bytes since memory is addressable by bytes and not bits. Therefore, even in only 21 bits are needed in this case, hardware designers would probably choose `L = 32` to make access faster, and just reserve bits the remaining bits for later usage. The actual value for `L` on x86 is 32 bits.

### Address translation in single level scheme

Once the page tables have been set up by the OS, the address translation between linear and physical addresses is done *by the hardware*.

When the OS wants to activate process 1, it sets the `cr3` to `PT1`, the start of the table for process one.

If Process 1 wants to access linear address `0x00000001`, the paging *hardware* circuit automatically does the following for the OS:

-   split the linear address into two parts:

        | page (20 bits) | offset (12 bits) |

    So in this case we would have:

    - page = 0x00000
    - offset = 0x001

-   look into Page table 1 because `cr3` points to it.

-   look entry `0x00000` because that is the page part.

    The hardware knows that this entry is located at RAM address `PT1 + 0 * L = PT1`.

-   since it is present, the access is valid

-   by the page table, the location of page number `0x00000` is at `0x00001 * 4K = 0x00001000`.

-   to find the final physical address we just need to add the offset:

          00001 000
        + 00000 001
          -----------
          00001 001

    because `00001` is the physical address of the page looked up on the table and `001` is the offset.

    As the name indicates, the offset is always simply added the physical address of the page.

-   the hardware then gets the memory at that physical location.

In the same way, the following translations would happen for process 1:

    linear     physical
    ---------  ---------
    00000 002  00001 002
    00000 003  00001 003
    00000 FFF  00001 FFF
    00001 000  00000 000
    00001 001  00000 001
    00001 FFF  00000 FFF
    00002 000  00002 000
    FFFFF 000  00005 000

For example, when accessing address `00001000`, the page part is `00001` the hardware knows that its page table entry is located at RAM address: `PT1 + 1 * L` (`1` because of the page part), and that is where it will look for it.

When the OS wants to switch to process 2, all it needs to do is to make `cr3` point to page 2. It is that simple!

Now the following translations would happen for process 2:

    linear     physical
    ---------  ---------
    00000 002  00001 002
    00000 003  00001 003
    00000 FFF  00001 FFF
    00001 000  00000 000
    00001 001  00000 001
    00001 FFF  00000 FFF
    00003 000  00003 000
    FFFFF 000  00004 000

*The same linear address translates to different physical addresses for different processes*, depending only on the value inside `cr3`.

In this way every program can expect its data to start at `0` and end at `FFFFFFFF`, without worrying about exact physical addresses.

### Page fault

What if Process 1 tries to access an address inside a page that is no present?

The hardware notifies the software via a Page Fault Exception.

It is then usually up to the OS to register an exception handler to decide what has to be done.

It is possible that accessing a page that is not on the table is a programming error:

    int is[1];
    is[2] = 1;

but there may be cases in which it is acceptable, for example in Linux when:

-   the program wants to increase its stack.

    It just tries to accesses a certain byte in a given possible range, and if the OS is happy it adds that page to the process address space.

-   the page was swapped to disk.

    The OS will need to do some work behind the processes back to get the page back into RAM.

    The OS can discover that this is the case based on the contents of the rest of the page table entry, since if the present flag is clear, the other entries of the page table entry are completely left for the OS to to what it wants.

    On Linux for example, when present = 0:

    -   if all the fields of the page table entry are 0, invalid address.

    -   else, the page has been swapped to disk, and the actual values of those fields encode the position of the page on the disk.

In any case, the OS needs to know which address generated the Page Fault to be able to deal with the problem. This is why the nice IA32 developers set the value of `cr2` to that address whenever a Page Fault occurs. The exception handler can then just look into `cr2` to get the address.

### Simplifications

Simplifications to reality that make this example easier to understand:

-   all real paging circuits use multi-level paging to save space, but this showed a simple single level scheme.

-   page tables contained only two fields: a 20 bit address and a 1 bit present flag.

    Real page tables contain a total of 12 fields, and therefore other features which have been omitted.

## Example: multi level paging scheme

The problem with a single level paging scheme is that it would take up too much RAM: 4G / 4K = 1M entries *per* process. If each entry is 4 bytes long, that would make 4M *per process*, which is too much even for a desktop computer: `ps -A | wc -l` says that I am running 244 processes right now, so that would take around 1GB of my RAM!

For this reason, x86 developers decided to use a multi level scheme that reduces RAM usage.

The downside of this system is that is has a slightly higher access time.

In the simple 3 level paging scheme used for 32 bit processors without PAE, the 32 address bits are divided as follows:

    | directory (10 bits) | table (10 bits) | offset (12 bits) |

Each process must have one and only one page directory associated to it, so it will contain at least `2^10 = 1K` page directory entries, much better than the minimum 1M required on a single level scheme.

Page tables are only allocated as needed by the OS. Each page table has `2^10 = 1K` page directory entries

Page directories contain... page directory entries! Page directory entries are the same as page table entries except that *they point to RAM addresses of page tables instead of physical addresses of tables*. Since those addresses are only 20 bits wide, page tables must be on the beginning of 4KB pages.

`cr3` now points to the location on RAM of the page directory of the current process instead of page tables.

Page tables entries don't change at all from a single level scheme.

Page tables change from a single level scheme because:

- each process may have up to 1K page tables, one per page directory entry.
- each page table contains exactly 1K entries instead of 1M entries.

The reason for using 10 bits on the first two levels (and not, say, `12 | 8 | 12` ) is that each Page Table entry is 4 bytes long. Then the 2^10 entries of Page directories and Page Tables will fit nicely into 4Kb pages. This means that it faster and simpler to allocate and deallocate pages for that purpose.

### Address translation in multi-level scheme

Page directory given to process 1 by the OS:

    RAM location     physical address   present
    ---------------  -----------------  --------
    PD1 + 0     * L  0x10000            1
    PD1 + 1     * L                     0
    PD1 + 2     * L  0x80000            1
    PD1 + 3     * L                     0
    ...                                 ...
    PD1 + 0x3FF * L                     0

Page tables given to process 1 by the OS at `PT1 = 0x10000000` (`0x10000` * 4K):

    RAM location      physical address   present
    ---------------   -----------------  --------
    PT1 + 0     * L   0x00001            1
    PT1 + 1     * L                      0
    PT1 + 2     * L   0x0000D            1
    ...                                  ...
    PT1 + 0x3FF * L   0x00005            1

Page tables given to process 1 by the OS at `PT2  = 0x80000000` (`0x80000` * 4K):

    RAM location      physical address   present
    ---------------   -----------------  --------
    PT2 + 0     * L   0x0000A            1
    PT2 + 1     * L   0x0000C            1
    PT2 + 2     * L                      0
    ...                                  ...
    PT2 + 0x3FF * L   0x00003            1

where:

- `PD1`: initial position of page directory of process 1 on RAM.
- `PT1` and `PT2`: initial position of page table 1 and page table 2 for process 1 on RAM.

So in this example the page directory and the page table could be stored in RAM something like:

    ----------------> 0xFFFFFFFF


    ----------------> PT2 + 0x3FF * L
    Page Table 1
    ----------------> PT2

    ----------------> PD1 + 0x3FF * L
    Page Directory 1
    ----------------> PD1


    ----------------> PT1 + 0x3FF * L
    Page Table 2
    ----------------> PT1

    ----------------> 0x0

Let's translate the linear address `0x00801004` step by step.

We suppose that `cr3 = PD1`, that is, it points to the page directory just described.

In binary the linear address is:

    0    0    8    0    1    0    0    4
    0000 0000 1000 0000 0001 0000 0000 0100

Grouping as `10 | 10 | 12` gives:

    0000000010 0000000001 000000000100
    0x2        0x1        0x4

which gives:

- page directory entry = 0x2
- page table     entry = 0x1
- offset               = 0x4

So the hardware looks for entry 2 of the page directory.

The page directory table says that the page table is located at `0x80000 * 4K = 0x80000000`. This is the first RAM access of the process.

Since the page table entry is `0x1`, the hardware looks at entry 1 of the page table at `0x80000000`, which tells it that the physical page is located at address `0x0000C * 4K = 0x0000C000`. This is the second RAM access of the process.

Finally, the paging hardware adds the offset, and the final address is `0x0000C004`.

Other examples of translated addresses are:

    linear    10 10 12 split   physical
    --------  ---------------  ----------
    00000001  000 000 001      00001001
    00001001  000 001 001      page fault
    003FF001  000 3FF 001      00005001
    00400000  001 000 000      page fault
    00800001  002 000 001      0000A001
    00801008  002 001 008      0000C008
    00802008  002 002 008      page fault
    00B00001  003 000 000      page fault

Page faults occur if either a page directory entry or a page table entry is not present.

If the OS wants to run another process concurrently, it would give the second process a separate page directory, and link that directory to separate page tables.

## 64-bit architectures

64 bits is still too much address for current RAM sizes, so most architectures will use less bits.

x86_64 uses 48 bits (256 TiB), and legacy mode's PAE already allows 52-bit addresses (4 PiB).

12 of those 48 bits are already reserved for the offset, which leaves 36 bits.

If a 2 level approach is taken, the best split would be two 18 bit levels.

But that would mean that the page directory would have `2^18 = 256K` entries, which would take too much RAM: close to a single level paging for 32 bit architectures!

Therefore, 64 bit architectures create even further page levels, commonly 3 or 4.

x86_64 uses 4 levels in a `9 | 9 | 9 | 12` scheme, so that the upper level only takes up only `2^9` higher level entries.

## PAE

Physical address extension.

With 32 bits, only 4GB RAM can be addressed.

This started becoming a limitation for large servers, so Intel introduced the PAE mechanism to Pentium Pro.

To relieve the problem, Intel added 4 new address lines, so that 64GB could be addressed.

Page table structure is also altered if PAE is on. The exact way in which it is altered depends on weather PSE is on or off.

PAE is turned on and off via the `PAE` bit of `cr4`.

Even if the total addressable memory is 64GB, individual process are still only able to use up to 4GB. The OS can however put different processes on different 4GB chunks.

## PSE

Page size extension.

Allows for pages to be 4M ( or 2M if PAE is on ) in length instead of 4K.

PSE is turned on and off via the `PAE` bit of `cr4`.

## PAE and PSE page table schemes

If either PAE and PSE are active, different paging level schemes are used:

-   no PAE and no PSE: `10 | 10 | 12`

-   no PAE and PSE: `10 | 22`.

    22 is the offset within the 4Mb page, since 22 bits address 4Mb.

-   PAE and no PSE: `2 | 9 | 9 | 12`

    The design reason why 9 is used twice instead of 10 is that now entries cannot fit anymore into 32 bits, which were all filled up by 20 address bits and 12 meaningful or reserved flag bits.

    The reason is that 20 bits are not enough anymore to represent the address of page tables: 24 bits are now needed because of the 4 extra wires added to the processor.

    Therefore, the designers decided to increase entry size to 64 bits, and to make them fit into a single page table it is necessary reduce the number of entries to 2^9 instead of 2^10.

    The starting 2 is a new Page level called Page Directory Pointer Table (PDPT), since it *points* to page directories and fill in the 32 bit linear address. PDPTs are also 64 bits wide.

    `cr3` now points to PDPTs which must be on the fist four 4GB of memory and aligned on 32 bit multiples for addressing efficiency. This means that now `cr3` has 27 significative bits instead of 20: 2^5 for the 32 multiples * 2^27 to complete the 2^32 of the first 4GB.

-   PAE and PSE: `2 | 9 | 21`

    Designers decided to keep a 9 bit wide field to make it fit into a single page.

    This leaves 23 bits. Leaving 2 for the PDPT to keep things uniform with the PAE case without PSE leaves 21 for offset, meaning that pages are 2M wide instead of 4M.

## TLB

The Translation Lookahead Buffer (TLB) is a cache for paging addresses.

Since it is a cache, it shares many of the design issues of the CPU cache, such as associativity level.

This section shall describe a simplified fully associative TLB with 4 single address entries. Note that like other caches, real TLBs are not usually fully associative.

### Basic operation

After a translation between linear and physical address happens, it is stored on the TLB. For example, a 4 entry TLB starts in the following state:

      valid   linear   physical
      ------  -------  ---------
    > 0       00000    00000
      0       00000    00000
      0       00000    00000
      0       00000    00000

The `>` indicates the current entry to be replaced.

and after a page linear address `00003` is translated to a physical address `00005`, the TLB becomes:

      valid   linear   physical
      ------  -------  ---------
      1       00003    00005
    > 0       00000    00000
      0       00000    00000
      0       00000    00000

and after a second translation of `00007` to `00009` it becomes:

      valid   linear   physical
      ------  -------  ---------
      1       00003    00005
      1       00007    00009
    > 0       00000    00000
      0       00000    00000

Now if `00003` needs to be translated again, hardware first looks up the TLB and finds out its address with a single RAM access `00003 --> 00005`.

Of course, `00000` is not on the TLB since no valid entry contains `00000` as a key.

### Replacement policy

When TLB is filled up, older addresses are overwritten. Just like for CPU cache, the replacement policy is a potentially complex operation, but a simple and reasonable heuristic is to remove the least recently used entry (LRU).

With LRU, starting from state:

      valid   linear   physical
      ------  -------  ---------
    > 1       00003    00005
      1       00007    00009
      1       00009    00001
      1       0000B    00003

adding `0000D -> 0000A` would give:

      valid   linear   physical
      ------  -------  ---------
      1       0000D    0000A
    > 1       00007    00009
      1       00009    00001
      1       0000B    00003

### CAM

Using the TLB makes translation faster, because the initial translation takes one access *per TLB level*, which means 2 on a simple 32 bit scheme, but 3 or 4 on 64 bit architectures.

The TLB is usually implemented as an expensive type of RAM called content-addressable memory (CAM). CAM implements an associative map on hardware, that is, a structure that given a key (linear address), retrieves a value.

Mappings could also be implemented on RAM addresses, but CAM mappings may required much less entries than a RAM mapping.

For example, a map in which:

- both keys and values have 20 bits (the case of a simple paging schemes)
- at most 4 values need to be stored at each time

could be stored in a TLB with 4 entries:

    linear   physical
    -------  ---------
    00000    00001
    00001    00010
    00010    00011
    FFFFF    00000

However, to implement this with RAM, *it would be necessary to have 2^20 addresses*:

    linear   physical
    -------  ---------
    00000    00001
    00001    00010
    00010    00011
    ... (from 00011 to FFFFE)
    FFFFF    00000

which would be even more expensive than using a TLB.

### Invalidating entries

When `cr3` changes, all TLB entries are invalidated, because a new page table for a new process is going to be used, so it is unlikely that any of the old entries have any meaning.

The x86 also offers the `invlpg` instruction which explicitly invalidates a single TLB entry. Other architectures offer even more instructions to invalidated TLB entries, such as invalidating all entries on a given range.

## Bibliography

Free:

-   [rutgers-pxk-416][] chapter "Memory management: lecture notes"

    Good historical review of memory organization techniques used by older OS.

Non-free:

-   [bovet05][] chapter "Memory addressing"

    Reasonable intro to x86 memory addressing. Missing some good and simple examples.

[bovet05]: http://www.amazon.com/books/dp/0596005652
[rutgers-pxk-416]: http://www.cs.rutgers.edu/~pxk/416/notes/
